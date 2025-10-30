"use server";

import { Prisma, SellerVerificationStatus } from "@prisma/client";

import {
  ForbiddenError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} from "@/lib/custom-error";
import shopRepository from "@/repositories/shop.repository";
import { fileUploadService } from "@/services/file-upload";
import { notificationService } from "@/services/notification";
import {
  ActionResponse,
  createSuccessResponse,
  CursorPaginatedResponse,
} from "@/types/response.types";

import { verifyAdmin } from "../authentication/admin";

export async function getAllShopsAction(options: {
  limit?: number;
  cursor?: string;
  search?: string;
  is_active?: boolean;
  verification_status?: SellerVerificationStatus;
}): Promise<
  ActionResponse<
    CursorPaginatedResponse<{
      id: string;
      name: string;
      description: string;
      location: string;
      is_active: boolean;
      verification_status: SellerVerificationStatus;
      created_at: Date;
      user: {
        id: string;
        name: string;
        email: string;
      };
    }>
  >
> {
  try {
    await verifyAdmin();

    const limit = options.limit || 20;
    const where: Prisma.ShopWhereInput | undefined = {};

    if (options.search) {
      where.OR = [
        { name: { contains: options.search, mode: "insensitive" } },
        { description: { contains: options.search, mode: "insensitive" } },
        { location: { contains: options.search, mode: "insensitive" } },
      ];
    }

    if (options.is_active !== undefined) {
      where.is_active = options.is_active;
    }

    if (options.verification_status) {
      where.verification_status = options.verification_status;
    }

    const shops = await shopRepository.findMany({
      where,
      take: limit + 1,
      skip: options.cursor ? 1 : 0,
      cursor: options.cursor ? { id: options.cursor } : undefined,
      orderBy: { created_at: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    const hasMore = shops.length > limit;
    const data = hasMore ? shops.slice(0, -1) : shops;
    const nextCursor = hasMore ? data[data.length - 1].id : null;

    return createSuccessResponse(
      {
        data: data.map((shop) => ({
          id: shop.id,
          name: shop.name,
          description: shop.description,
          location: shop.location,
          is_active: shop.is_active,
          verification_status: shop.verification_status,
          created_at: shop.created_at,
          user: shop.user!,
        })),
        nextCursor,
        hasMore,
      },
      "Shops retrieved successfully"
    );
  } catch (error) {
    console.error("GET ALL SHOPS ERROR:", error);
    if (error instanceof UnauthorizedError || error instanceof ForbiddenError) {
      throw error;
    }
    throw new InternalServerError("Failed to retrieve shops.");
  }
}

export async function activateShopAction(
  shopId: string
): Promise<ActionResponse<{ id: string; name: string; is_active: boolean }>> {
  try {
    await verifyAdmin();

    const shop = await shopRepository.findById(shopId, {
      include: { user: { select: { id: true } } },
    });
    if (!shop) {
      throw new NotFoundError("Shop not found");
    }

    if (shop.is_active) {
      throw new ForbiddenError("Shop is already active");
    }

    const updatedShop = await shopRepository.update(shopId, {
      is_active: true,
    });

    await notificationService.publishNotification(shop.user!.id, {
      title: "Shop Activated",
      message: `Your shop "${shop.name}" has been activated by an admin.`,
      type: "SUCCESS",
      category: "SYSTEM",
      action_url: "/owner-shops",
    });
    return createSuccessResponse(
      {
        id: updatedShop.id,
        name: updatedShop.name,
        is_active: updatedShop.is_active,
      },
      `Successfully activated shop "${updatedShop.name}"`
    );
  } catch (error) {
    console.error("ACTIVATE SHOP ERROR:", error);
    if (
      error instanceof UnauthorizedError ||
      error instanceof ForbiddenError ||
      error instanceof NotFoundError
    ) {
      throw error;
    }
    throw new InternalServerError("Failed to activate shop.");
  }
}

export async function deactivateShopAction(
  shopId: string
): Promise<ActionResponse<{ id: string; name: string; is_active: boolean }>> {
  try {
    await verifyAdmin();

    const shop = await shopRepository.findById(shopId, {
      include: { user: { select: { id: true } } },
    });
    if (!shop) {
      throw new NotFoundError("Shop not found");
    }

    if (!shop.is_active) {
      throw new ForbiddenError("Shop is already inactive");
    }

    const updatedShop = await shopRepository.update(shopId, {
      is_active: false,
    });

    await notificationService.publishNotification(shop.user!.id, {
      title: "Shop Deactivated",
      message: `Your shop "${shop.name}" has been deactivated by an admin.`,
      type: "WARNING",
      category: "SYSTEM",
      action_url: "/owner-shops",
    });

    return createSuccessResponse(
      {
        id: updatedShop.id,
        name: updatedShop.name,
        is_active: updatedShop.is_active,
      },
      `Successfully deactivated shop "${updatedShop.name}"`
    );
  } catch (error) {
    console.error("DEACTIVATE SHOP ERROR:", error);
    if (
      error instanceof UnauthorizedError ||
      error instanceof ForbiddenError ||
      error instanceof NotFoundError
    ) {
      throw error;
    }
    throw new InternalServerError("Failed to deactivate shop.");
  }
}

export async function deleteShopAction(
  shopId: string
): Promise<ActionResponse<{ id: string; name: string }>> {
  try {
    await verifyAdmin();

    const shop = await shopRepository.findById(shopId, {
      include: { user: { select: { id: true } } },
    });

    if (!shop) {
      throw new NotFoundError("Shop not found");
    }

    if (shop.image_key) {
      try {
        await fileUploadService.deleteFile(shop.image_key);
      } catch (error) {
        console.error("Error deleting shop image:", error);
      }
    }

    await shopRepository.delete(shopId);

    await notificationService.publishNotification(shop.user!.id, {
      title: "Shop Deleted",
      message: `Your shop "${shop.name}" has been deleted by an admin.`,
      type: "ERROR",
      category: "SYSTEM",
    });

    return createSuccessResponse(
      {
        id: shop.id,
        name: shop.name,
      },
      `Successfully deleted shop "${shop.name}"`
    );
  } catch (error) {
    console.error("DELETE SHOP ERROR:", error);
    if (
      error instanceof UnauthorizedError ||
      error instanceof ForbiddenError ||
      error instanceof NotFoundError
    ) {
      throw error;
    }
    throw new InternalServerError("Failed to delete shop.");
  }
}

export async function updateShopVerificationAction(
  shopId: string,
  status: SellerVerificationStatus
): Promise<
  ActionResponse<{
    id: string;
    name: string;
    verification_status: SellerVerificationStatus;
  }>
> {
  try {
    await verifyAdmin();

    const shop = await shopRepository.findById(shopId, {
      include: { user: { select: { id: true } } },
    });
    if (!shop) {
      throw new NotFoundError("Shop not found");
    }

    const updatedShop = await shopRepository.update(shopId, {
      verification_status: status,
    });

    const statusMessages = {
      NOT_STARTED: "has been reset to not started",
      PENDING: "is now pending verification",
      REQUIRES_ACTION: "requires action from you",
      VERIFIED: "has been verified",
      REJECTED: "verification has been rejected",
    };

    await notificationService.publishNotification(shop.user!.id, {
      title: "Shop Verification Status Updated",
      message: `Your shop "${shop.name}" ${statusMessages[status]}.`,
      type:
        status === "VERIFIED"
          ? "SUCCESS"
          : status === "REJECTED"
            ? "ERROR"
            : "INFO",
      category: "SYSTEM",
      action_url: "/owner-shops",
    });

    return createSuccessResponse(
      {
        id: updatedShop.id,
        name: updatedShop.name,
        verification_status: updatedShop.verification_status,
      },
      `Successfully updated verification status for "${updatedShop.name}"`
    );
  } catch (error) {
    console.error("UPDATE SHOP VERIFICATION ERROR:", error);
    if (
      error instanceof UnauthorizedError ||
      error instanceof ForbiddenError ||
      error instanceof NotFoundError
    ) {
      throw error;
    }
    throw new InternalServerError("Failed to update shop verification status.");
  }
}

export async function getShopStatsAction(): Promise<
  ActionResponse<{
    totalShops: number;
    activeShops: number;
    inactiveShops: number;
    verifiedShops: number;
    pendingVerification: number;
    recentShops: number;
  }>
> {
  try {
    await verifyAdmin();

    const [
      totalShops,
      activeShops,
      verifiedShops,
      pendingVerification,
      recentShops,
    ] = await Promise.all([
      shopRepository.count({}),
      shopRepository.count({ is_active: true }),
      shopRepository.count({ verification_status: "VERIFIED" }),
      shopRepository.count({ verification_status: "PENDING" }),
      shopRepository.count({
        created_at: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
        },
      }),
    ]);

    return createSuccessResponse(
      {
        totalShops,
        activeShops,
        inactiveShops: totalShops - activeShops,
        verifiedShops,
        pendingVerification,
        recentShops,
      },
      "Shop statistics retrieved successfully"
    );
  } catch (error) {
    console.error("GET SHOP STATS ERROR:", error);
    if (error instanceof UnauthorizedError || error instanceof ForbiddenError) {
      throw error;
    }
    throw new InternalServerError("Failed to retrieve shop statistics.");
  }
}

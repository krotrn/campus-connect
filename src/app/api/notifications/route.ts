import { NextRequest, NextResponse } from "next/server";

import { authUtils } from "@/lib/utils/auth.utils";
import { notificationService } from "@/services/notification";
import { createErrorResponse, createSuccessResponse } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const user_id = await authUtils.getUserId();

    const searchParams = request.nextUrl.searchParams;
    const cursor = searchParams.get("cursor") || undefined;
    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!, 10)
      : 20;

    const paginatedNotifications =
      await notificationService.getUserNotifications(user_id, limit, cursor);

    return NextResponse.json(createSuccessResponse(paginatedNotifications), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    const errorResponse = createErrorResponse("Failed to fetch notifications");
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user_id = await authUtils.getUserId();
    const { notification_ids, broadcast_notification_ids } =
      await request.json();

    if (notification_ids && notification_ids.length > 0) {
      await notificationService.markNotificationsAsRead(notification_ids);
    }

    if (broadcast_notification_ids && broadcast_notification_ids.length > 0) {
      await notificationService.markBroadcastsAsRead(
        user_id,
        broadcast_notification_ids
      );
    }

    return NextResponse.json(
      createSuccessResponse(null, "Notifications marked as read"),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    return NextResponse.json(
      createErrorResponse("Failed to mark notifications as read"),
      { status: 500 }
    );
  }
}

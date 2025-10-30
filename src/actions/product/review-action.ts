"use server";

import { unauthorized } from "next/navigation";

import { InternalServerError } from "@/lib/custom-error";
import { authUtils } from "@/lib/utils/auth.utils";
import { reviewService } from "@/services/review";
import { createSuccessResponse } from "@/types";

export const createReviewAction = async ({
  product_id,
  order_item_id,
  rating,
  comment,
}: {
  product_id: string;
  order_item_id: string;
  rating: number;
  comment: string;
}) => {
  try {
    const user_id = await authUtils.getUserId();
    if (!user_id) {
      return unauthorized();
    }

    const review = await reviewService.createReview(
      { rating, comment },
      product_id,
      order_item_id,
      user_id
    );

    return createSuccessResponse(review);
  } catch (error) {
    console.log("Error creating review:", error);
    throw new InternalServerError("Failed to create review");
  }
};

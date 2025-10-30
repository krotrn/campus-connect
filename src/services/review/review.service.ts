import { ReviewFormData } from "@/components/orders/review-form";
import productRepository from "@/repositories/product.repository";
import reviewRepository from "@/repositories/reviews.repository";

import { notificationService } from "./notification.service";

class ReviewService {
  async createReview(
    data: ReviewFormData,
    product_id: string,
    order_item_id: string,
    user_id: string
  ) {
    const review = await reviewRepository.createReview({
      comment: data.comment,
      rating: data.rating,
      product: { connect: { id: product_id } },
      user: { connect: { id: user_id } },
      order_item: { connect: { id: order_item_id } },
    });
    const product = await productRepository.findById(product_id, {
      include: { shop: { include: { user: { select: { id: true } } } } },
    });
    if (product && product.shop && product.shop.user) {
      await notificationService.publishNotification(product.shop.user.id, {
        title: "New Review on Your Product",
        message: `Your product ${product.name} has received a new review.`,
        action_url: `/product/${product.id}`,
        type: "INFO",
      });
    }
    return review;
  }
}

export const reviewService = new ReviewService();
export default reviewService;

/**
 * Query utilities module for centralized React Query cache management operations.
 *
 * This module provides a comprehensive utility class for managing React Query cache operations
 * in the college connect application. It offers a convenient wrapper around the QueryClient
 * with domain-specific methods for cache invalidation, prefetching, and data manipulation.
 *
 * @example
 * ```typescript
 * // Basic usage in a component
 * function ProductPage({ shopId }: { shopId: string }) {
 *   const queryUtils = useQueryUtils();
 *
 *   const handleAddToCart = async () => {
 *     // ... add to cart logic
 *     await queryUtils.invalidateShopCart(shopId);
 *   };
 *
 *   const handlePrefetchShop = () => {
 *     queryUtils.prefetchShop(shopId);
 *   };
 *
 *   return (
 *     <div>
 *       <button onClick={handleAddToCart}>Add to Cart</button>
 *       <button onClick={handlePrefetchShop}>Prefetch Shop</button>
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Usage in mutation hooks
 * function useAddToCart() {
 *   const queryUtils = useQueryUtils();
 *
 *   return useMutation({
 *     mutationFn: addToCartAPI,
 *     onSuccess: (data, variables) => {
 *       // Invalidate specific shop cart
 *       queryUtils.invalidateShopCart(variables.shopId);
 *
 *       // Optionally invalidate all carts
 *       queryUtils.invalidateAllCarts();
 *     }
 *   });
 * }
 * ```
 *
 * @see {@link queryKeys} for the underlying query key structure
 * @see {@link https://tanstack.com/query/latest/docs/react/reference/QueryClient} QueryClient Reference
 *
 * @since 1.0.0
 */
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "./query-keys";
import { FullCart } from "@/services/cart.services";

/**
 * Utility class for centralized React Query cache management operations.
 *
 * Provides a comprehensive set of methods for managing query cache state including
 * invalidation, prefetching, and direct cache manipulation. This class wraps the
 * QueryClient with domain-specific methods that align with the application's data structure.
 *
 * @example
 * ```typescript
 * // Direct instantiation (rarely needed)
 * const queryClient = new QueryClient();
 * const queryUtils = new QueryUtils(queryClient);
 *
 * // Preferred usage via hook
 * function MyComponent() {
 *   const queryUtils = useQueryUtils();
 *
 *   const handleClearCache = () => {
 *     queryUtils.clearAllCache();
 *   };
 *
 *   return <button onClick={handleClearCache}>Clear Cache</button>;
 * }
 * ```
 *
 * @param queryClient - The React Query client instance for cache operations
 *
 * @since 1.0.0
 */
export class QueryUtils {
  constructor(private queryClient: QueryClient) {}

  invalidateAllCarts() {
    return this.queryClient.invalidateQueries({
      queryKey: queryKeys.cart.all,
    });
  }

  invalidateShopCart(shopId: string) {
    return this.queryClient.invalidateQueries({
      queryKey: queryKeys.cart.byShop(shopId),
    });
  }

  invalidateAllOrders() {
    return this.queryClient.invalidateQueries({
      queryKey: queryKeys.orders.all,
    });
  }

  invalidateUserOrders(userId: string) {
    return this.queryClient.invalidateQueries({
      queryKey: queryKeys.users.orders(userId),
    });
  }

  invalidateSellerOrders() {
    return this.queryClient.invalidateQueries({
      queryKey: queryKeys.seller.orders(),
    });
  }

  invalidateShopProducts(shopId: string) {
    return this.queryClient.invalidateQueries({
      queryKey: queryKeys.shops.products(shopId),
    });
  }

  clearAllCache() {
    return this.queryClient.clear();
  }

  async prefetchShop(shopId: string) {
    const { shopAPIService } = await import("@/services/api");

    return this.queryClient.prefetchQuery({
      queryKey: queryKeys.shops.detail(shopId),
      queryFn: () => shopAPIService.fetchShop({ shop_id: shopId }),
      staleTime: 1000 * 60 * 5, // 5 minutes
    });
  }

  async prefetchShopProducts(shopId: string) {
    const { productAPIService } = await import("@/services/api");

    return this.queryClient.prefetchInfiniteQuery({
      queryKey: queryKeys.shops.products(shopId),
      queryFn: ({ pageParam }) =>
        productAPIService.fetchShopProducts({
          shop_id: shopId,
          cursor: pageParam as string | null,
        }),
      initialPageParam: null,
      staleTime: 1000 * 60 * 5,
    });
  }

  getCachedShop(shopId: string) {
    return this.queryClient.getQueryData(queryKeys.shops.detail(shopId));
  }

  getCachedCart(shopId: string) {
    return this.queryClient.getQueryData(queryKeys.cart.byShop(shopId));
  }

  /**
   * Updates cached cart data for a specific shop without triggering a network request.
   *
   * Directly modifies cart data in the cache, enabling optimistic updates
   * and immediate UI responses. Use with caution and ensure data consistency
   * with server state through proper invalidation strategies.
   *
   * @example
   * ```typescript
   * // Optimistic cart update during add to cart
   * const handleOptimisticAdd = async (shopId: string, product: Product) => {
   *   const currentCart = queryUtils.getCachedCart(shopId) || [];
   *   const newCart = [...currentCart, product];
   *
   *   // Optimistic update
   *   queryUtils.setCachedCart(shopId, newCart);
   *
   *   try {
   *     await addToCartAPI({ shopId, productId: product.id });
   *   } catch (error) {
   *     // Rollback on error
   *     queryUtils.setCachedCart(shopId, currentCart);
   *     throw error;
   *   }
   * };
   * ```
   *
   * @param shop_id - The unique identifier of the shop whose cart should be updated
   * @param data - The new cart data to store in cache
   * @returns The updated cache data
   *
   * @see {@link getCachedCart} for retrieving cached cart data
   * @see {@link invalidateShopCart} for invalidating cart cache
   * @see {@link queryKeys.cart.byShop} for the underlying query key factory
   *
   * @warning Direct cache manipulation can lead to inconsistencies if not properly managed
   *
   * @since 1.0.0
   */
  setCachedCart(shop_id: string, data: FullCart) {
    return this.queryClient.setQueryData(queryKeys.cart.byShop(shop_id), data);
  }
}

export function useQueryUtils() {
  const queryClient = useQueryClient();
  return new QueryUtils(queryClient);
}

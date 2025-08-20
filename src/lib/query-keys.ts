/**
 * Centralized query key factory for React Query cache management in the college connect application.
 *
 * This module provides a structured approach to query key generation for consistent cache
 * management across the application. It follows the hierarchical query key pattern recommended
 * by TanStack Query for optimal cache invalidation and data synchronization.
 *
 * @example
 * ```typescript
 * // Basic usage in React Query hooks
 * function useUserProfile(userId: string) {
 *   return useQuery({
 *     queryKey: queryKeys.users.profile(userId),
 *     queryFn: () => fetchUserProfile(userId)
 *   });
 * }
 *
 * // Cache invalidation after mutations
 * function useUpdateUser() {
 *   const queryClient = useQueryClient();
 *
 *   return useMutation({
 *     mutationFn: updateUserProfile,
 *     onSuccess: (data, variables) => {
 *       // Invalidate specific user profile
 *       queryClient.invalidateQueries({
 *         queryKey: queryKeys.users.profile(variables.userId)
 *       });
 *
 *       // Invalidate all user queries
 *       queryClient.invalidateQueries({
 *         queryKey: queryKeys.users.all
 *       });
 *     }
 *   });
 * }
 *
 * // Shop products with pagination
 * function useShopProducts(shopId: string, cursor?: string) {
 *   return useInfiniteQuery({
 *     queryKey: queryKeys.shops.products(shopId, cursor),
 *     queryFn: ({ pageParam }) => fetchShopProducts(shopId, pageParam)
 *   });
 * }
 * ```
 *
 * @see {@link https://tanstack.com/query/latest/docs/react/guides/query-keys} TanStack Query Key Guide
 * @see {@link useOptimisticUserUpdate} for cache manipulation examples
 * @see {@link useLoginUser} for authentication-related query usage
 *
 * @since 1.0.0
 */
export const queryKeys = {
  /**
   * User-related query keys for profile management, orders, and authentication.
   */
  users: {
    all: ["users"] as const,
    orders: (userId: string) => ["users", userId, "orders"] as const,
    profile: (userId: string) => ["users", userId, "profile"] as const,
  },

  /**
   * Shopping cart query keys for cart state management.
   *
   */
  cart: {
    all: ["cart"] as const,
    byShop: (shopId: string) => ["cart", "shop", shopId] as const,
  },

  /**
   * Shop-related query keys for shop information and product listings.
   */
  shops: {
    all: ["shops"] as const,
    detail: (shopId: string) => ["shops", shopId] as const,
    products: (shopId: string, cursor?: string | null) =>
      ["shops", shopId, "products", { cursor }] as const,
  },

  /**
   * Product catalog query keys for product management and browsing.
   */
  products: {
    all: ["products"] as const,
    byShop: (shopId: string) => ["products", "shop", shopId] as const,
    detail: (productId: string) => ["products", productId] as const,
  },

  /**
   * Order management query keys for order processing and tracking.
   */
  orders: {
    all: ["orders"] as const,
    byUser: (userId: string) => ["orders", "user", userId] as const,
    byShop: (shopId: string) => ["orders", "shop", shopId] as const,
    detail: (orderId: string) => ["orders", orderId] as const,
  },

  /**
   * Seller dashboard query keys for vendor management and analytics.
   */
  seller: {
    all: ["seller"] as const,
    orders: () => ["seller", "orders"] as const,
    dashboard: () => ["seller", "dashboard"] as const,
  },
} as const;

/**
 * Type definition for the complete query keys structure.
 *
 * @example
 * ```typescript
 * // Type-safe query key usage
 * function createUserQuery(keys: QueryKeys['users']) {
 *   return useQuery({
 *     queryKey: keys.all,
 *     queryFn: fetchAllUsers
 *   });
 * }
 * ```
 */
export type QueryKeys = typeof queryKeys;

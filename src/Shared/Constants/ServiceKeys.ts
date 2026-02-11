/**
 * Service Keys Constants
 * 
 * Centralized service key definitions for dependency injection.
 * Using constants prevents typos and makes refactoring easier.
 * 
 * @example
 * ServiceProvider.register(SERVICE_KEYS.PRODUCT_REPOSITORY, repository);
 * const repo = ServiceProvider.resolve(SERVICE_KEYS.PRODUCT_REPOSITORY);
 */

export const SERVICE_KEYS = {
    PRODUCT_REPOSITORY: 'ProductRepository',
    GRAPHQL_SERVICE: 'GraphQLService',
    PRODUCT_CONTROLLER: 'ProductController',
} as const;

// Type for service keys
export type ServiceKey = typeof SERVICE_KEYS[keyof typeof SERVICE_KEYS];

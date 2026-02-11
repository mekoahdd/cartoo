import { ApolloClient, InMemoryCache, HttpLink, gql, OperationVariables } from '@apollo/client';
import type { DocumentNode } from 'graphql';
import { Logger } from '@/Shared/Infrastructure/Logger';

/**
 * GraphQLError type guard for standard Error instances
 */
function isError(error: unknown): error is Error {
    return error instanceof Error;
}

/**
 * GraphQLService - Servicio de infraestructura para GraphQL
 * 
 * Encapsula Apollo Client y proporciona métodos de alto nivel para ejecutar queries.
 * Si en el futuro decidimos cambiar de cliente GraphQL (urql, graphql-request, etc.),
 * solo modificamos este archivo.
 * 
 * Principios aplicados:
 * - Single Responsibility: Solo maneja la comunicación GraphQL
 * - Encapsulation: Oculta los detalles de Apollo Client
 * - DRY: Centraliza la configuración del cliente
 * 
 * @example
 * const service = new GraphQLService('https://api.example.com/graphql');
 * const data = await service.query(MY_QUERY, { id: 1 });
 */
export class GraphQLService {
    private client: ApolloClient;

    constructor(uri: string) {
        this.client = new ApolloClient({
            link: new HttpLink({ 
                uri,
                fetch: (uri, options) => {
                    // Wrapper con timeout y mejor manejo de errores
                    return fetch(uri, {
                        ...options,
                        signal: AbortSignal.timeout(30000), // 30 segundos timeout
                    }).catch(error => {
                        // Mejorar mensajes de error de red
                        if (error.name === 'AbortError') {
                            throw new Error('Request timeout - Please check your connection');
                        }
                        if (error.message.includes('Failed to fetch')) {
                            throw new Error('Network error - Please check your internet connection');
                        }
                        throw error;
                    });
                }
            }),
            cache: new InMemoryCache({
                // Configurar caché para persitir datos
                typePolicies: {
                    Query: {
                        fields: {
                            products: {
                                merge(existing, incoming) {
                                    return incoming;
                                },
                            },
                            product: {
                                merge(existing, incoming) {
                                    return incoming;
                                },
                            },
                        },
                    },
                },
            }),
            defaultOptions: {
                watchQuery: {
                    // cache-first: Usa caché si está disponible, funciona offline
                    fetchPolicy: 'cache-first',
                    errorPolicy: 'all',
                },
                query: {
                    // cache-first: Prioriza caché, permite funcionamiento offline
                    fetchPolicy: 'cache-first',
                    errorPolicy: 'all',
                },
            },
        });
    }

    /**
     * Ejecuta una query GraphQL
     * @param query - Query GraphQL (puede ser string o DocumentNode)
     * @param variables - Variables para la query
     * @returns Promise con los datos de la respuesta
     * @throws Error si la query falla
     */
    async query<T = unknown, TVariables extends OperationVariables = OperationVariables>(
        query: string | DocumentNode,
        variables?: TVariables
    ): Promise<T> {
        try {
            const queryDocument = typeof query === 'string' ? gql(query) : query;

            const result = await this.client.query<T, TVariables>({
                query: queryDocument,
                variables: variables as TVariables,
            });

            // Verificar si hay errores en el resultado
            if (result.error) {
                throw new Error(result.error.message);
            }

            if (!result.data) {
                throw new Error('No data returned from GraphQL query');
            }

            return result.data;
        } catch (error: unknown) {
            const errorMessage = isError(error) ? error.message : String(error);
            Logger.error('GraphQL Query Error', errorMessage);
            
            // Mejorar mensajes de error
            if (errorMessage.includes('Network error') || errorMessage.includes('Failed to fetch')) {
                // Si hay error de red, intentar con caché
                Logger.warn('Network error detected, attempting to use cached data...');
                
                try {
                    // Intentar obtener datos del caché de Apollo
                    const cachedResult = await this.client.query<T, TVariables>({
                        query: queryDocument,
                        variables: variables as TVariables,
                        fetchPolicy: 'cache-only', // Solo caché
                    });
                    
                    if (cachedResult.data) {
                        Logger.info('Using cached data (offline mode)');
                        return cachedResult.data;
                    }
                } catch (cacheError) {
                    const cacheErrorMsg = cacheError instanceof Error ? cacheError.message : 'Unknown cache error';
                    Logger.error('No cached data available', cacheErrorMsg);
                }
                
                throw new Error('Unable to connect to the server. Please check your internet connection and try again.');
            }
            
            if (errorMessage.includes('timeout')) {
                throw new Error('Request timed out. The server is taking too long to respond.');
            }
            
            throw error;
        }
    }

    /**
     * Obtiene el cliente Apollo directamente
     * Útil si necesitas acceso de bajo nivel
     */
    getClient(): ApolloClient {
        return this.client;
    }
}

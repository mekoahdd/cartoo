import { Logger } from './Logger';

/**
 * ServiceProvider - Gestiona la inyección de dependencias
 *
 * Este servicio implementa el patrón Service Locator para gestionar
 * las dependencias de la aplicación de forma centralizada.
 *
 * Beneficios:
 * - Desacoplamiento entre capas
 * - Facilita testing (inyectar mocks)
 * - Respeta principio de inversión de dependencias (SOLID)
 *
 * @example
 * // Registrar una dependencia
 * ServiceProvider.register<UserRepositoryContract>('UserRepository', new UserRepository());
 *
 * // Resolver una dependencia
 * const repository = ServiceProvider.resolve<UserRepositoryContract>('UserRepository');
 */
class ServiceProviderClass {
  private services: Map<string, unknown> = new Map();

  /**
   * Registra una implementación concreta de un servicio
   * @param key - Identificador único del servicio
   * @param implementation - Implementación concreta
   */
  register<T>(key: string, implementation: T): void {
    if (this.services.has(key)) {
      Logger.warn(`Service "${key}" is already registered. It will be overwritten.`);
    }
    this.services.set(key, implementation);
  }

  /**
   * Resuelve una dependencia previamente registrada
   * @param key - Identificador del servicio
   * @returns La implementación registrada
   * @throws Error si el servicio no está registrado
   */
  resolve<T>(key: string): T {
    const service = this.services.get(key);

    if (!service) {
      throw new Error(
        `Servicio "${key}" no encontrado. ` +
          `Asegúrate de registrarlo con ServiceProvider.register() ` +
          `antes de intentar resolverlo.`,
      );
    }

    return service as T;
  }

  /**
   * Limpia todas las dependencias registradas
   * Útil para testing
   */
  clear(): void {
    this.services.clear();
  }

  /**
   * Verifica si un servicio está registrado
   */
  has(key: string): boolean {
    return this.services.has(key);
  }
}

// Singleton - Una única instancia para toda la aplicación
export const ServiceProvider = new ServiceProviderClass();

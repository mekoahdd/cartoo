/**
 * CustomException - Clase base para todas las excepciones personalizadas
 * 
 * Extiende Error nativo de JavaScript y agrega un código de estado HTTP
 * para facilitar el manejo de errores en la capa de infraestructura
 * 
 * @example
 * class ProductNotFoundException extends CustomException {
 *   constructor(productId: number) {
 *     super(`Product with ID ${productId} not found`, 404);
 *   }
 * }
 */

// Type declaration for V8 stack trace support
interface ErrorConstructor {
  captureStackTrace?(target: object, constructorOpt?: Function): void;
}

export class CustomException extends Error {
  public readonly statusCode: number;
  public readonly timestamp: Date;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.timestamp = new Date();
    
    // Mantiene el stack trace correcto (solo en entornos V8 como Node.js/Chrome)
    const ErrorConstructor = Error as ErrorConstructor;
    if (typeof ErrorConstructor.captureStackTrace === 'function') {
      ErrorConstructor.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Serializa la excepción a un objeto plano
   * Útil para logging y debugging
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
      timestamp: this.timestamp.toISOString(),
      stack: this.stack,
    };
  }
}

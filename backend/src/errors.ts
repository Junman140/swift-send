export class AppError extends Error {
  public code: string;
  public statusCode: number;
  public details?: any;

  constructor(message: string, code = 'app_error', statusCode = 400, details?: any) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation failed', details?: any) {
    super(message, 'validation_error', 400, details);
  }
}

export class ExternalServiceError extends AppError {
  constructor(message = 'External service error', details?: any) {
    super(message, 'external_service_error', 502, details);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Not found') {
    super(message, 'not_found', 404);
  }
}

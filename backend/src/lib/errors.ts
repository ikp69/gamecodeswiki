export class AppError extends Error {
  public readonly title: string;
  public readonly status: number;
  public readonly code: string;

  constructor(title: string, status: number, detail: string, code: string) {
    super(detail);
    this.title = title;
    this.status = status;
    this.code = code;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class NotFoundError extends AppError {
  constructor(detail: string = 'The requested resource was not found') {
    super('Not Found', 404, detail, 'NOT_FOUND');
  }
}

export class ValidationError extends AppError {
  constructor(detail: string = 'Validation failed') {
    super('Validation Error', 422, detail, 'VALIDATION_ERROR');
  }
}

export class ForbiddenError extends AppError {
  constructor(detail: string = 'Access denied') {
    super('Forbidden', 403, detail, 'FORBIDDEN');
  }
}

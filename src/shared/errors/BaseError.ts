export class BaseError extends Error {
    public readonly code: string;
    public readonly status: number;
    public readonly details?: unknown;

    constructor(code: string, message: string, status = 500, details?: unknown) {
        super(message);
        this.code = code;
        this.status = status;
        this.details = details;
        Error.captureStackTrace?.(this, this.constructor);
    }
}

export class ValidationError extends BaseError {
    constructor(message: string, details?: unknown) {
        super('VALIDATION_ERROR', message, 400, details);
    }
}

export class NotFoundError extends BaseError {
    constructor(message: string, details?: unknown) {
        super('NOT_FOUND', message, 404, details);
    }
}

export class ConflictError extends BaseError {
    constructor(message: string, details?: unknown) {
        super('CONFLICT', message, 409, details);
    }
}
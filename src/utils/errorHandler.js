

// utils/errorHandler.js

class ApiError extends Error {
    constructor(statusCode, message, errors = []) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
        Error.captureStackTrace(this, this.constructor);
    }
}

const errorTypes = {
    VALIDATION_ERROR: "ValidationError",
    NOT_FOUND: "NotFoundError",
    UNAUTHORIZED: "UnauthorizedError",
    FORBIDDEN: "ForbiddenError",
    SERVER_ERROR: "ServerError"
};

// Middleware for handling errors globally
const errorHandler = (err, req, res, next) => {
    let { statusCode, message } = err;

    if (!statusCode) {
        statusCode = 500; // Default to internal server error
    }

    return res.status(statusCode).json({
        success: false,
        message,
        errors: err.errors || []
    });
};

// Custom error generators
const createError = {
    validation: (message, errors = []) => new ApiError(400, message, errors),
    notFound: (message = "Resource not found") => new ApiError(404, message),
    unauthorized: (message = "Unauthorized access") => new ApiError(401, message),
    forbidden: (message = "Forbidden") => new ApiError(403, message),
    serverError: (message = "Internal Server Error") => new ApiError(500, message),
};

module.exports = {
    ApiError,
    errorHandler,
    createError,
    errorTypes
};

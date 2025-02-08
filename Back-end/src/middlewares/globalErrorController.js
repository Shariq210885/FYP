const AppError = require('./AppError');

const HandleCastErrorDB = (error, res) => {
    const message = `Invalid ${error.path}: ${error.value}`;
    return new AppError(message, 400);
};

const HandleDuplicateFieldErrorDB = (error, res) => {
    const value = error.keyValue.email;
    const message = `Duplicate field value: ${value} please use another value`;
    return new AppError(message, 400);
};

const ValidationErrorDB = (err, res) => {
    const errors = Object.values(err.errors).map((el) => el.message);
    const message = `Invalid input data: ${errors.join('. ')}`;
    return new AppError(message, 404);
};

const handlJWTExpireError = (err, res) => new AppError("Token Expired, please login again.", 401);

// this will run when the app is in development environment
const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    });
};

// this will run when app is in production environment
const sendErrorProd = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    } else {
        res.status(err.statusCode).json({
            status: err.status,
            message: 'something went very wrong',
        });
    }
};

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    }
    if (process.env.NODE_ENV === 'production') {
        let error = { ...err, name: err.name, message: err.message };
        if (error.name === 'CastError') error = HandleCastErrorDB(error, res);

        if (error.code === 11000) error = HandleDuplicateFieldErrorDB(error, res);

        if (error.name === 'ValidationError') error = ValidationErrorDB(error, res);

        if (error.name === 'TokenExpiredError') error = handlJWTExpireError(error, res);

        sendErrorProd(error, res);
    }
};

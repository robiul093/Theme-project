import { ZodError } from "zod";
import { ErrorRequestHandler } from "express";
import { AppError } from "../utils/app_error";

export const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = "Internal Server Error";
  let errorSources: any = [];

  if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation Error";
    errorSources = err.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message.includes("expected string") 
        ? `${issue.path.join(".")} field is required` 
        : issue.message,
    }));
  } else if (err?.name === "ValidationError") {
    statusCode = 400;
    message = "Validation Error";
    errorSources = Object.values(err.errors).map((val: any) => ({
      path: val.path,
      message: val.message,
    }));
  } else if (err?.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID";
    errorSources = [{
      path: err.path,
      message: `${err.value} is not a valid ID`,
    }];
  } else if (err?.code === 11000) {
    statusCode = 409;
    message = "Duplicate Key Error";
    const field = Object.keys(err.keyValue)[0];
    errorSources = [{
      path: field,
      message: `${field} already exists`,
    }];
  } else if (err instanceof AppError) {
    statusCode = err.statusCode || 400;
    message = err.message;
    errorSources = [{
      path: "",
      message: err.message,
    }];
  } else if (err instanceof Error) {
    message = err.message;
    errorSources = [{
      path: "",
      message: err.message,
    }];
  }

  console.error("🔥 Error:", err);

  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    stack: process.env.NODE_ENV === "development" ? err?.stack : null,
  });
};

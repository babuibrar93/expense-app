import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiResponse } from '../dtos/api-response.dto';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let message = 'Internal Server Error';
    let statusCode = exception?.getStatus?.() ?? HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse() as any;
      const exceptionStatusCode = exception.getStatus();

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        return response
          .status(exceptionStatusCode)
          .json(
            new ApiResponse(
              false,
              exceptionStatusCode,
              exceptionResponse.message,
              exceptionResponse.data
            )
          );
      }
    }

    // Handle Validation Errors from class-validator
    if (exception instanceof BadRequestException) {
      const validationErrors = exception.getResponse() as any;
      const errors = validationErrors?.message ?? 'Bad Request Exception';

      return response.status(400).json(new ApiResponse(false, 400, errors));
    }

    message = exception?.message || 'Internal server error';

    response.status(statusCode).json(new ApiResponse(false, statusCode, message));
    console.log(exception.stack);
  }
}

export class APIError {
  constructor(statusCode = 500, message = 'Internal server error') {
    this.success = false;
    this.statusCode = statusCode;
    this.message = message;
  }
}

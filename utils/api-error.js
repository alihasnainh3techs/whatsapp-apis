export class APIError {
  constructor(statusCode = 500, message = 'Internal server error') {
    this.statusCode = statusCode;
    this.message = message;
  }
}

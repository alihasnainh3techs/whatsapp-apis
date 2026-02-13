export class APIResponse {
  constructor(statusCode = 200, message = '', data = {}) {
    this.success = true;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}

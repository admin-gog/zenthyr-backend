class ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;

  constructor(statusCode: number, data: T, message: string = "Success") {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}

export { ApiResponse };

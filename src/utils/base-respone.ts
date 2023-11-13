export class BaseRespone {
  message: string;
  status: number;
  data: object | null;
  constructor(message: string, status: number, data = null) {
    this.message = message;
    this.status = status;
    this.data = data;
  }
}

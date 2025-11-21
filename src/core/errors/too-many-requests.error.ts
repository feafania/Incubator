import { HTTP_STATUSES } from "../types/http-statuses";

export class TooManyRequestsError extends Error {
  public status: number;

  constructor(message = "Too many requests. Please try again later.") {
    super(message);
    this.status = HTTP_STATUSES.TOO_MANY_REQUESTS_429;
  }
}

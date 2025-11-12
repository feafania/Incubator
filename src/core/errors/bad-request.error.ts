export class BadRequestError extends Error {
  constructor(
    detail: string,
    public readonly source?: string,
  ) {
    super(detail);
  }
}

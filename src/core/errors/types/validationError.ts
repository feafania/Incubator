import { HttpStatusType } from "../../types/http-statuses";

export type ValidationErrorType = {
  status: HttpStatusType;
  detail: string;
  source?: string;
  code?: string;
};

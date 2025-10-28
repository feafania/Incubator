import { matchedData } from "express-validator";
import { QueryInput, RequestWithQuery, SortDirections } from "../db/types";

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_SORT_BY = "createdAt";
export const DEFAULT_SORT_DIRECTION = SortDirections.Desc;

/**
 * Пост-валидатор: збірае matchedData з express-validator, парсіць значэнні
 * і вяртае тыпізаваны QueryInput<T> з падстаўленымі дэфолтамі.
 *
 * T — набор дапушчальных значэнняў для sortBy (readonly string[])
 */
export function buildValidatedQuery<T extends string>(
  req: RequestWithQuery<QueryInput<T>>,
  options?: {
    defaults?: Partial<QueryInput<T>>;
  },
): QueryInput<T> {
  const validated = matchedData(req, {
    locations: ["query"],
    includeOptionals: true,
  }) as Partial<QueryInput<T>> & Record<string, any>;

  const rawQuery = req.query as Record<string, any>;

  const defaults = options?.defaults ?? {};

  const result: QueryInput<T> = {
    ...(rawQuery as any), // пакідаем усе астатнія палі (напр. searchNameTerm)
    ...validated, // але правераныя перазапісваюць сырыя
    pageNumber:
      Number(validated.pageNumber ?? rawQuery.pageNumber) ||
      defaults.pageNumber ||
      DEFAULT_PAGE,
    pageSize:
      Number(validated.pageSize ?? rawQuery.pageSize) ||
      defaults.pageSize ||
      DEFAULT_PAGE_SIZE,
    sortBy:
      validated.sortBy ??
      (rawQuery.sortBy as T) ??
      defaults.sortBy ??
      (DEFAULT_SORT_BY as T),
    sortDirection:
      validated.sortDirection ??
      (rawQuery.sortDirection as SortDirections) ??
      defaults.sortDirection ??
      DEFAULT_SORT_DIRECTION,
  };

  return result;
}

import { matchedData } from "express-validator";
import { SortDirections } from "../../types/sort-direction";
import { RequestWithQuery } from "../../types/request";
import { QueryInput } from "../../types/input-response";
import { paginationAndSortingDefault } from "./query-pagination-sorting.validation-middleware";

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
      paginationAndSortingDefault.pageNumber,
    pageSize:
      Number(validated.pageSize ?? rawQuery.pageSize) ||
      defaults.pageSize ||
      paginationAndSortingDefault.pageSize,
    sortBy:
      validated.sortBy ??
      (rawQuery.sortBy as T) ??
      defaults.sortBy ??
      (paginationAndSortingDefault.sortBy as T),
    sortDirection:
      validated.sortDirection ??
      (rawQuery.sortDirection as SortDirections) ??
      defaults.sortDirection ??
      paginationAndSortingDefault.sortDirection,
  };

  return result;
}

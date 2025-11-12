import { SortDirections } from "../../types/sort-direction";
import { query } from "express-validator";
import { PaginationAndSorting } from "../../types/pagination-and-sorting";

const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_SORT_BY = "createdAt";
const DEFAULT_SORT_DIRECTION = SortDirections.Desc;

export const paginationAndSortingDefault: PaginationAndSorting<string> = {
  pageNumber: DEFAULT_PAGE_NUMBER,
  pageSize: DEFAULT_PAGE_SIZE,
  sortBy: DEFAULT_SORT_BY,
  sortDirection: DEFAULT_SORT_DIRECTION,
};

export function paginationAndSortingValidation<T extends string>(
  sortFieldsArray: readonly T[],
  defaults?: {
    pageNumber?: number;
    pageSize?: number;
    sortDirection?: SortDirections;
    sortBy?: T;
  },
) {
  const {
    pageNumber = DEFAULT_PAGE_NUMBER,
    pageSize = DEFAULT_PAGE_SIZE,
    sortBy = DEFAULT_SORT_BY,
    sortDirection = DEFAULT_SORT_DIRECTION,
  } = defaults || {};

  return [
    query("pageNumber")
      .optional()
      .default(pageNumber)
      .isInt({ min: 1 })
      .withMessage("Page number must be a positive integer")
      .toInt(),

    query("pageSize")
      .optional()
      .default(pageSize)
      .isInt({ min: 1 })
      .withMessage("Page size must be not less than 1")
      .toInt(),

    query("sortBy")
      .optional()
      .default(sortBy)
      .isIn(sortFieldsArray)
      .withMessage(`Allowed sort fields: ${sortFieldsArray.join(", ")}`),

    query("sortDirection")
      .optional()
      .default(sortDirection)
      .isIn(Object.values(SortDirections))
      .withMessage(
        `Sort direction must be one of: ${Object.values(SortDirections).join(", ")}`,
      ),
  ];
}

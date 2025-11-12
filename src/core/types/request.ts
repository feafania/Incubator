import { Request } from "express";

export type RequestWithBody<T> = Request<{}, {}, T>;
export type RequestWithQuery<T> = Request<{}, {}, {}, T>;
export type RequestWithParams<T> = Request<T>;
export type RequestWithParamsAndBody<T, B> = Request<T, {}, B>;
export type RequestWithParamsAndQuery<T, B> = Request<T, {}, {}, B>;

// interface Request<
//   Params = {},     // параметры маршруту (напрыклад, /user/:id → { id: string })
//   ResBody = any,   // цела адказу (можна не выкарыстоўваць)
//   ReqBody = any,   // цела запыту (напрыклад, POST-запыты)
//   ReqQuery = any   // query-параметры (?sort=asc&page=2)
// > {
//     params: Params;
//     body: ReqBody;
//     query: ReqQuery;
//     // іншыя ўласцівасці, як напрыклад: headers, method, url, і г.д.
// }

export interface Params {
  id: string; // Параметры звычайна маюць тып `string`, бо яны паступаюць з URL
}

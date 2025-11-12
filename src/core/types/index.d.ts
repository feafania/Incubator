import "express";
import { Request } from "express";
/**
 * Чтобы указать Typescript о том, что мы добавили новые значения
 * и свойства в глобальной области видимости
 * (как, например, в нашем случае добавление “user” или “userId“ в Request)
 * нужно создать файл index.d.ts (его еще называют декларативным или заголовочным).
 * Декларативный файл index.d.ts должен быть подключен к проекту в tsconfig.json
 */
declare global {
  namespace Express {
    export interface Request {
      userId: string | null;
    }
  }
}

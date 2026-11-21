import camelcaseKeys from "camelcase-keys";
import snakecaseKeys from "snakecase-keys";
import { CamelCasedPropertiesDeep } from "type-fest";

type ObjectLike = Record<string, unknown>;
export type ToCamelCase<T> = "_id" extends keyof T
  ? Omit<CamelCasedPropertiesDeep<T>, "id" | "Id"> & { _id: T["_id"] }
  : CamelCasedPropertiesDeep<T>;

export const toCamel = <TInput extends ObjectLike>(
  obj: TInput | readonly TInput[],
): ToCamelCase<TInput> => {
  return camelcaseKeys(obj, {
    deep: true,
    exclude: ["_id"],
  }) as ToCamelCase<TInput>;
};

export function toSnake<TOutput extends ObjectLike>(
  obj: readonly any[],
): TOutput[];
export function toSnake<TOutput extends ObjectLike>(obj: any): TOutput;
export function toSnake(obj: any): any {
  return snakecaseKeys(obj, { deep: true, exclude: ["_id"] });
}

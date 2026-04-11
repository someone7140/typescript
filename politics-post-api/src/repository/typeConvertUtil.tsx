import camelcaseKeys from "camelcase-keys";
import snakecaseKeys from "snakecase-keys";
import { CamelCasedPropertiesDeep } from "type-fest";

type ObjectLike = Record<string, unknown>;
export type ToCamelCase<T> = "_id" extends keyof T
  ? Omit<CamelCasedPropertiesDeep<T>, "id" | "Id"> & { _id: T["_id"] }
  : CamelCasedPropertiesDeep<T>;

const collectDateKeys = (
  obj: unknown,
  keys = new Set<string>(),
): Set<string> => {
  if (Array.isArray(obj)) {
    obj.forEach((v) => collectDateKeys(v, keys));
  } else if (
    obj !== null &&
    typeof obj === "object" &&
    !(obj instanceof Date)
  ) {
    Object.entries(obj as ObjectLike).forEach(([k, v]) => {
      if (v instanceof Date) keys.add(k);
      else collectDateKeys(v, keys);
    });
  }
  return keys;
};

export const toCamel = <TInput extends ObjectLike>(
  obj: TInput | readonly TInput[],
): ToCamelCase<TInput> => {
  const exclude = ["_id", ...collectDateKeys(obj)];
  return camelcaseKeys(obj, { deep: true, exclude }) as ToCamelCase<TInput>;
};

export const toSnake = <TOutput extends ObjectLike>(
  obj: ObjectLike | readonly ObjectLike[],
): TOutput => {
  const exclude = ["_id", ...collectDateKeys(obj)];
  return snakecaseKeys(obj, { deep: true, exclude }) as TOutput;
};

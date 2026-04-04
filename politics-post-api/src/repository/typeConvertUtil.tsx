import camelcaseKeys from "camelcase-keys";
import snakecaseKeys from "snakecase-keys";

type ObjectLike = Record<string, unknown>;

export const toCamel = <TOutput extends ObjectLike>(
  obj: ObjectLike | readonly ObjectLike[],
): TOutput => {
  return camelcaseKeys(obj, { deep: true, exclude: ["_id"] }) as TOutput;
};

export const toSnake = <TOutput extends ObjectLike>(
  obj: ObjectLike | readonly ObjectLike[],
): TOutput => {
  return snakecaseKeys(obj, { deep: true, exclude: ["_id"] }) as TOutput;
};

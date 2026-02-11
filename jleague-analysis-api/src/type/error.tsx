import { GraphQLError } from "graphql";

export const NOT_FOUND_ERROR = "NOT_FOUND";

export class AppGraphQLError extends GraphQLError {
  constructor(message: string, code: string, extra?: Record<string, unknown>) {
    super(message, {
      extensions: {
        code,
        ...extra,
      },
    });
  }
}

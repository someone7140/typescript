import { GraphQLError } from "graphql";

export const AUTH_ERROR = "AUTH_ERROR";
export const FORBIDDEN_ERROR = "FORBIDDEN_ERROR";
export const BAD_REQUEST = "BAD_REQUEST";

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

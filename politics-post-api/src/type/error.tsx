import { GraphQLError } from "graphql";

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

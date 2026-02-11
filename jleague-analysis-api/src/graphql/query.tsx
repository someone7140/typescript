import { GraphQLContext } from "@/type/context";

export const setQueries = (
  builder: PothosSchemaTypes.SchemaBuilder<
    PothosSchemaTypes.ExtendDefaultTypes<{
      Context: GraphQLContext;
    }>
  >,
) => {
  builder.queryType({
    fields: (t) => ({
      ping: t.boolean({
        args: {},
        resolve: (_root, _args, _context) => {
          return true;
        },
      }),
    }),
  });
};

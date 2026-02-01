export const setQueries = (
  builder: PothosSchemaTypes.SchemaBuilder<
    PothosSchemaTypes.ExtendDefaultTypes<{}>
  >,
) => {
  builder.queryType({
    fields: (t) => ({
      ping: t.boolean({
        args: {},
        resolve: (_root, _args) => {
          return true;
        },
      }),
    }),
  });
};

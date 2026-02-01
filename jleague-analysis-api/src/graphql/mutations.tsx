export const setMutations = (
  builder: PothosSchemaTypes.SchemaBuilder<
    PothosSchemaTypes.ExtendDefaultTypes<{}>
  >,
) => {
  builder.mutationType({
    fields: (t) => ({
      batchUpdateMaster: t.boolean({
        args: {
          year: t.arg.int({ required: true }),
        },
        resolve: (_root, _args) => {
          return true;
        },
      }),
    }),
  });
};

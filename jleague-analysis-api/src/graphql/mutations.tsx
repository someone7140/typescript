import { updateTeamAndLeagueInfo } from "@/service/dataCollectionService";
import { GraphQLContext } from "@/type/context";

export const setMutations = (
  builder: PothosSchemaTypes.SchemaBuilder<
    PothosSchemaTypes.ExtendDefaultTypes<{
      Context: GraphQLContext;
    }>
  >,
) => {
  builder.mutationType({
    fields: (t) => ({
      batchUpdateMaster: t.boolean({
        args: {
          year: t.arg.int({ required: true }),
          frameId: t.arg.int({ required: true }),
          category: t.arg.string({ required: true }),
        },
        resolve: async (_root, args, context) => {
          await updateTeamAndLeagueInfo(
            context.env,
            context.get("db"),
            args.year,
            args.frameId,
            args.category,
          );
          return true;
        },
      }),
    }),
  });
};

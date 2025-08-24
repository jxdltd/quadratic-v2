import { LinearClient } from "@linear/sdk";
import { serve } from "bun";
import { Console, Data, Effect } from "effect";
import z from "zod";

const apiKey = process.env.API_KEY!; // todo: validate
const teamId = process.env.TEAM_ID!;

class InvalidSchemaError extends Data.TaggedError("InvalidSchemaError")<{
  readonly problem: string;
}> {}

class LinearError extends Data.TaggedError("LinearError")<{}> {}

const teamIdSchema = z.uuid();

const validateTeamId = (teamId: string) =>
  Effect.suspend(() =>
    teamIdSchema.safeParse(teamId).success
      ? Effect.succeed(teamId)
      : Effect.fail(new InvalidSchemaError({ problem: "Invalid team ID" }))
  );

const createClient = () => Effect.sync(() => new LinearClient({ apiKey }));

const createIssue = (client: LinearClient, teamId: string, title: string) =>
  Effect.tryPromise({
    try: () => client.createIssue({ title, teamId }),
    catch: () => new LinearError(),
  });

const program = validateTeamId(teamId).pipe(
  Effect.andThen(createClient),
  Effect.andThen((client) => createIssue(client, teamId, "test")),
  Effect.andThen(() => Effect.succeed(new Response("Ok!"))),
  Effect.catchTag("InvalidSchemaError", (e) =>
    Effect.succeed(new Response(e.problem, { status: 400 }))
  ),
  Effect.catchTag("LinearError", (e) =>
    Effect.succeed(new Response("Internal server error", { status: 500 }))
  )
);

serve({
  port: 3000,
  fetch: (req) => Effect.runPromise(program),
});

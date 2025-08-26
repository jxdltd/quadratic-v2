import { LinearClient } from "@linear/sdk";
import { serve } from "bun";
import { Data, Effect } from "effect";
import z from "zod";

// const apiKey = process.env.API_KEY!; // todo: validate
// const teamId = process.env.TEAM_ID!;

class InvalidSchemaError extends Data.TaggedError("InvalidSchemaError")<{
  readonly problem: string;
}> {}

class LinearError extends Data.TaggedError("LinearError")<{}> {}

const teamIdSchema = z.uuid();

const bodySchema = z.object({
  title: z.string().min(3).max(1000),
});

const validateTeamId = (teamId: string) =>
  Effect.suspend(() =>
    teamIdSchema.safeParse(teamId).success
      ? Effect.succeed(teamId)
      : Effect.fail(new InvalidSchemaError({ problem: "Invalid team ID" }))
  );

const validateBody = (body: unknown) =>
  Effect.try({
    try: () => bodySchema.parse(body),
    catch: () => new InvalidSchemaError({ problem: "Invalid body" }),
  });

const createClient = (apiKey: string) =>
  Effect.sync(() => new LinearClient({ apiKey }));

const createIssue = (client: LinearClient, teamId: string, title: string) =>
  Effect.tryPromise({
    try: () => client.createIssue({ title, teamId }),
    catch: () => new LinearError(),
  });

// todo: automatically check environment
export type Options = {
  apiKey: string;
  teamId: string;
};

export const createHandler = (opts: Options) => async (req: Request) =>
  Effect.runPromise(
    validateTeamId(opts.teamId).pipe(
      Effect.andThen(
        Effect.zip(createClient(opts.apiKey), validateBody(await req.json()))
      ),
      Effect.andThen(([client, body]) =>
        createIssue(client, opts.teamId, body.title)
      ),
      Effect.andThen(() => Effect.succeed(new Response("Ok!"))),
      Effect.catchTags({
        InvalidSchemaError: (e) =>
          Effect.succeed(new Response(e.problem, { status: 400 })),
        LinearError: (e) =>
          Effect.succeed(
            new Response("Internal server error", { status: 500 })
          ),
      })
    )
  );

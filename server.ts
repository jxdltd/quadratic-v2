import { Effect } from "effect";
import { LinearService, createLinearService } from "./context";

const program = Effect.gen(function* () {
  const linear = yield* LinearService;

  yield* linear.createIssue("test");
});

export function handle(apiKey: string) {
  return (request: Request) => {
    const responseProgram = program.pipe(
      Effect.andThen(() => Effect.succeed(new Response("Ok!"))),
      Effect.provideService(LinearService, createLinearService(apiKey))
    );

    return Effect.runSync(responseProgram);
  };
}

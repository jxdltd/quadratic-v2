import { Effect } from "effect";
import { LinearService, LiveLinearService } from "./context";

const program = Effect.gen(function* () {
  const linear = yield* LinearService;

  linear.createIssue("test");

  return new Response("Hello, world!!!");
});

export function handle() {
  return (request: Request) => {
    return Effect.runSync(
      Effect.provideService(program, LinearService, LiveLinearService)
    );
  };
}

import { LinearClient, LinearError } from "@linear/sdk";
import { Context, Effect } from "effect";

export class LinearService extends Context.Tag("LinearService")<
  LinearService,
  { readonly createIssue: (title: string) => Effect.Effect<void, LinearError> }
>() {}

export function createLinearService(apiKey: string) {
  const client = new LinearClient({
    apiKey,
  });

  return LinearService.of({
    createIssue: (title: string) =>
      Effect.tryPromise({
        try: () =>
          client.createIssue({
            title,
            teamId: "1a034849-e9eb-4ff4-94fa-f85c7ad26df6",
          }),
        catch: (error) => new LinearError(),
      }),
  });
}

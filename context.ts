import { Context, Effect } from "effect";

export class LinearService extends Context.Tag("LinearService")<
  LinearService,
  { readonly createIssue: (title: string) => void }
>() {}

export const LiveLinearService = LinearService.of({
  createIssue: (title) => {
    console.log(`Creating issue ${title}`);
  },
});

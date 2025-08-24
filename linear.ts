import { Effect } from "effect";

export const createIssue = (title: string) =>
  Effect.sync(() => {
    console.log(`Creating issue ${title}`);
  });

import { Data } from "effect";

export class LinearError extends Data.TaggedError("LinearError")<{}> {}

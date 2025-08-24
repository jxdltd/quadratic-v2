import { serve } from "bun";
import { createHandler } from "../server";

serve({
  port: 3000,
  fetch: createHandler({
    apiKey: process.env.API_KEY!,
    teamId: process.env.TEAM_ID!,
  }),
});

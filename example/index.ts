import { serve } from "bun";
import { handle } from "../server";

serve({
  port: 3000,
  fetch: handle(process.env.API_KEY!),
});

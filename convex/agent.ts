import { v } from "convex/values";
import { query } from "./functions";
import { requireAgentKey } from "./agentAuth";

/* Checks an agent key and reads nothing.

   The spec endpoint in app/api/blog/spec/route.ts needs to authenticate a
   caller, but the secret lives here on the Convex deployment and nowhere else —
   the Next app only ever forwards the bearer it was given. Giving Next its own
   copy of BLOG_AGENT_API_KEY would be a second place to rotate and a second
   place to leak it.

   So the route asks Convex instead. Reusing posts.agentList for this would
   work, but it would fetch every post to answer a yes/no question. */
export const verifyKey = query({
  args: { apiKey: v.string() },
  handler: async (_ctx, args) => {
    requireAgentKey(args.apiKey);
    return { ok: true as const };
  },
});

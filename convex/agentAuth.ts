import { ConvexError } from "convex/values";

/* The shared secret every agent-authored write is checked against — blog posts
   and landing pages both. Verified inside each Convex function, not only at the
   HTTP edge, so a public Convex function URL is not itself a write path.

   One key for both surfaces on purpose: it's one caller, and a second secret
   would be a second thing to rotate and a second thing to leak. */

function secretMatches(provided: string, expected: string) {
  /* Length-first, then a constant-time compare that does not short-circuit on
     the first differing byte — the same shape as the newsletter check. */
  if (provided.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < provided.length; i++) {
    diff |= provided.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}

export function requireAgentKey(apiKey: string) {
  const expected = process.env.BLOG_AGENT_API_KEY;
  if (!expected) {
    /* An unset secret must refuse, never fall open — otherwise a missing env
       var quietly turns this into an unauthenticated write endpoint. */
    throw new ConvexError("Blog agent API is not configured.");
  }
  if (!secretMatches(apiKey, expected)) {
    throw new ConvexError("Invalid API key.");
  }
}

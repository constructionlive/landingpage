import { ConvexHttpClient } from "convex/browser"
import { api } from "../convex/_generated/api"

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL

export function getConvexServerClient() {
  if (!convexUrl) {
    throw new Error("NEXT_PUBLIC_CONVEX_URL is not configured.")
  }
  return new ConvexHttpClient(convexUrl)
}

export async function getPublishedPosts() {
  const client = getConvexServerClient()
  return await client.query(api.posts.listPublished, {})
}

export async function getPostBySlug(slug: string) {
  const client = getConvexServerClient()
  return await client.query(api.posts.getBySlug, { slug })
}

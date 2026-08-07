"use client";

import { FormEvent, useEffect, useState } from "react";
import { useConvex, useConvexAuth, useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import BlogEditor from "@components/blog/BlogEditor";

export default function NewBlogPage() {
  const router = useRouter();
  const convex = useConvex();
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const me = useQuery(api.users.me, isAuthenticated ? {} : "skip");
  const createPost = useMutation(api.posts.create);
  const generateImageUploadUrl = useMutation(api.posts.generateImageUploadUrl);
  const generateProfileImageUploadUrl = useMutation(api.users.generateProfileImageUploadUrl);
  const upsertMyProfile = useMutation(api.users.upsertMyProfile);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [content, setContent] = useState("<p></p>");
  const [profileName, setProfileName] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [profileImageStorageId, setProfileImageStorageId] = useState<Id<"_storage"> | undefined>(undefined);
  const [profileBio, setProfileBio] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [metaKeywords, setMetaKeywords] = useState("");
  const [canonicalUrl, setCanonicalUrl] = useState("");
  const [noIndex, setNoIndex] = useState(false);
  const [ogTitle, setOgTitle] = useState("");
  const [ogDescription, setOgDescription] = useState("");
  const [ogImageUrl, setOgImageUrl] = useState("");
  const [twitterCard, setTwitterCard] = useState<"summary" | "summary_large_image" | "">("");
  const [twitterTitle, setTwitterTitle] = useState("");
  const [twitterDescription, setTwitterDescription] = useState("");
  const [twitterImageUrl, setTwitterImageUrl] = useState("");
  const [seoOpen, setSeoOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingCoverImage, setUploadingCoverImage] = useState(false);
  const [uploadingProfileImage, setUploadingProfileImage] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    if (!me?.profile) return;
    setProfileName(me.profile.name ?? "");
    setProfileImageUrl(me.profile.image ?? "");
    setProfileImageStorageId(me.profile.profileImageStorageId);
    setProfileBio(me.profile.bio ?? "");
  }, [me]);

  async function uploadImage(file: File) {
    const uploadUrl = await generateImageUploadUrl();
    const uploadResult = await fetch(uploadUrl, {
      method: "POST",
      headers: { "Content-Type": file.type },
      body: file,
    });
    if (!uploadResult.ok) {
      throw new Error("Failed to upload image.");
    }

    const { storageId } = (await uploadResult.json()) as { storageId?: string };
    if (!storageId) {
      throw new Error("Invalid upload response.");
    }

    const imageUrl = await convex.query(api.posts.getImageUrl, {
      storageId: storageId as Id<"_storage">,
    });
    if (!imageUrl) {
      throw new Error("Could not resolve uploaded image URL.");
    }
    return imageUrl;
  }

  async function onCoverImageSelect(file: File) {
    setUploadingCoverImage(true);
    setError(null);
    try {
      const imageUrl = await uploadImage(file);
      setCoverImageUrl(imageUrl);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to upload cover image.";
      setError(message);
    } finally {
      setUploadingCoverImage(false);
    }
  }

  async function onProfileImageSelect(file: File) {
    setUploadingProfileImage(true);
    setProfileMessage(null);
    setError(null);
    try {
      const uploadUrl = await generateProfileImageUploadUrl();
      const uploadResult = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type || "application/octet-stream" },
        body: file,
      });
      if (!uploadResult.ok) {
        throw new Error("Failed to upload profile image.");
      }
      const { storageId } = (await uploadResult.json()) as { storageId?: string };
      if (!storageId) {
        throw new Error("Invalid upload response.");
      }
      const imageUrl = await convex.query(api.users.getProfileImageUrl, {
        storageId: storageId as Id<"_storage">,
      });
      if (!imageUrl) {
        throw new Error("Could not resolve profile image URL.");
      }
      setProfileImageUrl(imageUrl);
      setProfileImageStorageId(storageId as Id<"_storage">);
      setProfileMessage("Profile image uploaded.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to upload profile image.";
      setError(message);
    } finally {
      setUploadingProfileImage(false);
    }
  }

  async function onSaveProfile() {
    setSavingProfile(true);
    setProfileMessage(null);
    setError(null);
    try {
      await upsertMyProfile({
        name: profileName.trim() ? profileName.trim() : undefined,
        image: profileImageUrl.trim() ? profileImageUrl.trim() : undefined,
        profileImageStorageId,
        bio: profileBio.trim() ? profileBio.trim() : undefined,
      });
      setProfileMessage("Profile saved.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to save profile.";
      setError(message);
    } finally {
      setSavingProfile(false);
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const normalizedContent = content.replace(/<p>\s*<\/p>/g, "").trim();
    if (!normalizedContent) {
      setError("Post content cannot be empty.");
      return;
    }
    setSubmitting(true);
    try {
      await upsertMyProfile({
        name: profileName.trim() ? profileName.trim() : undefined,
        image: profileImageUrl.trim() ? profileImageUrl.trim() : undefined,
        profileImageStorageId,
        bio: profileBio.trim() ? profileBio.trim() : undefined,
      });
      await createPost({
        title,
        excerpt: excerpt.trim() ? excerpt.trim() : undefined,
        coverImageUrl: coverImageUrl.trim() ? coverImageUrl.trim() : undefined,
        content: normalizedContent,
        slug: slug.trim() ? slug.trim() : undefined,
        metaTitle: metaTitle.trim() || undefined,
        metaDescription: metaDescription.trim() || undefined,
        metaKeywords: metaKeywords.trim() || undefined,
        canonicalUrl: canonicalUrl.trim() || undefined,
        noIndex: noIndex || undefined,
        ogTitle: ogTitle.trim() || undefined,
        ogDescription: ogDescription.trim() || undefined,
        ogImageUrl: ogImageUrl.trim() || undefined,
        twitterCard: twitterCard || undefined,
        twitterTitle: twitterTitle.trim() || undefined,
        twitterDescription: twitterDescription.trim() || undefined,
        twitterImageUrl: twitterImageUrl.trim() || undefined,
      });
      router.push("/blog");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to create post.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  const role = me?.profile?.role;
  const canWrite = role === "writer" || role === "admin";
  const checkingAccess = authLoading || (isAuthenticated && me === undefined);

  if (checkingAccess) {
    return (
      <main className="mx-auto min-h-screen w-full max-w-3xl px-6 py-12 bg-do-bg">
        <p className="text-sm text-do-text-secondary">Checking access...</p>
      </main>
    );
  }

  if (!canWrite) {
    return (
      <main className="mx-auto min-h-screen w-full max-w-3xl px-6 py-12 bg-do-bg">
        <h1 className="text-4xl font-bold text-do-text">Writer access required</h1>
        <p className="mt-2 text-sm text-do-text-secondary">
          Your account does not have permission to publish blog posts.
        </p>
        <Link
          className="mt-6 inline-flex rounded-md border border-do-border px-4 py-2 text-sm text-do-text transition hover:border-do-orange/50 hover:text-do-orange"
          href="/blog"
        >
          Back to blog
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl px-6 py-12 bg-do-bg">
      <h1 className="text-4xl font-bold text-do-text">New Blog Post</h1>
      <p className="mt-2 text-sm text-do-text-secondary">
        Writer or admin role is required to publish.
      </p>
      <form className="mt-8 flex flex-col gap-4" onSubmit={onSubmit}>
        <input
          className="rounded-md border border-do-border bg-transparent px-3 py-2 text-sm text-do-text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          className="rounded-md border border-do-border bg-transparent px-3 py-2 text-sm text-do-text"
          placeholder="Slug (optional)"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
        />
        <textarea
          className="min-h-24 rounded-md border border-do-border bg-transparent px-3 py-2 text-sm text-do-text"
          placeholder="Excerpt (optional)"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
        />
        <div className="flex flex-col gap-2 rounded-md border border-do-border p-3">
          <label className="text-xs text-do-text-secondary">Cover Image URL (optional)</label>
          <input
            className="rounded-md border border-do-border bg-transparent px-3 py-2 text-sm text-do-text"
            placeholder="https://..."
            value={coverImageUrl}
            onChange={(e) => setCoverImageUrl(e.target.value)}
          />
          <div className="flex items-center gap-3">
            <label className="cursor-pointer rounded-md border border-do-border px-3 py-2 text-xs text-do-text hover:bg-do-bg-light/50">
              {uploadingCoverImage ? "Uploading..." : "Upload cover image"}
              <input
                className="hidden"
                type="file"
                accept="image/*"
                disabled={uploadingCoverImage}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  onCoverImageSelect(file);
                  e.target.value = "";
                }}
              />
            </label>
            {coverImageUrl ? (
              <span className="truncate text-xs text-do-text-secondary">Selected: {coverImageUrl}</span>
            ) : null}
          </div>
        </div>
        <BlogEditor
          value={content}
          onChange={setContent}
          onUploadImage={uploadImage}
          onError={setError}
        />
        <section className="rounded-md border border-do-border p-4">
          <button
            type="button"
            className="flex w-full items-center justify-between text-left"
            onClick={() => setSeoOpen((o) => !o)}
          >
            <div>
              <h2 className="text-sm font-semibold text-do-text">SEO &amp; Meta Tags (optional)</h2>
              <p className="mt-1 text-xs text-do-text-secondary">
                Customize meta title, description, Open Graph, Twitter cards, and more.
              </p>
            </div>
            <span className="text-do-text-secondary">{seoOpen ? "\u2212" : "+"}</span>
          </button>
          {seoOpen && (
            <div className="mt-4 flex flex-col gap-4">
              <fieldset className="flex flex-col gap-3">
                <legend className="text-xs font-medium text-do-text-secondary">General Meta</legend>
                <input className="rounded-md border border-do-border bg-transparent px-3 py-2 text-sm text-do-text" placeholder="Meta title" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} />
                <textarea className="min-h-20 rounded-md border border-do-border bg-transparent px-3 py-2 text-sm text-do-text" placeholder="Meta description" value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} />
                <input className="rounded-md border border-do-border bg-transparent px-3 py-2 text-sm text-do-text" placeholder="Meta keywords (comma-separated)" value={metaKeywords} onChange={(e) => setMetaKeywords(e.target.value)} />
                <input className="rounded-md border border-do-border bg-transparent px-3 py-2 text-sm text-do-text" placeholder="Canonical URL" value={canonicalUrl} onChange={(e) => setCanonicalUrl(e.target.value)} />
                <label className="flex items-center gap-2 text-sm text-do-text">
                  <input type="checkbox" checked={noIndex} onChange={(e) => setNoIndex(e.target.checked)} />
                  noindex: hide from search engines
                </label>
              </fieldset>
              <fieldset className="flex flex-col gap-3">
                <legend className="text-xs font-medium text-do-text-secondary">Open Graph</legend>
                <input className="rounded-md border border-do-border bg-transparent px-3 py-2 text-sm text-do-text" placeholder="OG title" value={ogTitle} onChange={(e) => setOgTitle(e.target.value)} />
                <textarea className="min-h-20 rounded-md border border-do-border bg-transparent px-3 py-2 text-sm text-do-text" placeholder="OG description" value={ogDescription} onChange={(e) => setOgDescription(e.target.value)} />
                <input className="rounded-md border border-do-border bg-transparent px-3 py-2 text-sm text-do-text" placeholder="OG image URL" value={ogImageUrl} onChange={(e) => setOgImageUrl(e.target.value)} />
              </fieldset>
              <fieldset className="flex flex-col gap-3">
                <legend className="text-xs font-medium text-do-text-secondary">Twitter Card</legend>
                <select className="rounded-md border border-do-border bg-transparent px-3 py-2 text-sm text-do-text" value={twitterCard} onChange={(e) => setTwitterCard(e.target.value as "" | "summary" | "summary_large_image")}>
                  <option value="">Auto (based on image)</option>
                  <option value="summary">summary</option>
                  <option value="summary_large_image">summary_large_image</option>
                </select>
                <input className="rounded-md border border-do-border bg-transparent px-3 py-2 text-sm text-do-text" placeholder="Twitter title" value={twitterTitle} onChange={(e) => setTwitterTitle(e.target.value)} />
                <textarea className="min-h-20 rounded-md border border-do-border bg-transparent px-3 py-2 text-sm text-do-text" placeholder="Twitter description" value={twitterDescription} onChange={(e) => setTwitterDescription(e.target.value)} />
                <input className="rounded-md border border-do-border bg-transparent px-3 py-2 text-sm text-do-text" placeholder="Twitter image URL" value={twitterImageUrl} onChange={(e) => setTwitterImageUrl(e.target.value)} />
              </fieldset>
            </div>
          )}
        </section>
        <section className="rounded-md border border-do-border p-4">
          <h2 className="text-sm font-semibold text-do-text">Author Profile</h2>
          <p className="mt-1 text-xs text-do-text-secondary">
            Set your name, profile image, and short bio for blog attribution.
          </p>
          <div className="mt-3 flex flex-col gap-3">
            <input className="rounded-md border border-do-border bg-transparent px-3 py-2 text-sm text-do-text" placeholder="Your display name" value={profileName} onChange={(e) => setProfileName(e.target.value)} />
            <input className="rounded-md border border-do-border bg-transparent px-3 py-2 text-sm text-do-text" placeholder="Profile image URL" value={profileImageUrl} onChange={(e) => { setProfileImageUrl(e.target.value); setProfileImageStorageId(undefined); }} />
            <div>
              <label className="cursor-pointer rounded-md border border-do-border px-3 py-2 text-xs text-do-text hover:bg-do-bg-light/50">
                {uploadingProfileImage ? "Uploading..." : "Upload profile image"}
                <input className="hidden" type="file" accept="image/*" disabled={uploadingProfileImage} onChange={(e) => { const file = e.target.files?.[0]; if (!file) return; onProfileImageSelect(file); e.target.value = ""; }} />
              </label>
            </div>
            <textarea className="min-h-20 rounded-md border border-do-border bg-transparent px-3 py-2 text-sm text-do-text" placeholder="Short bio (optional)" value={profileBio} onChange={(e) => setProfileBio(e.target.value)} />
            <div className="flex items-center gap-3">
              <button type="button" className="rounded-md border border-do-border px-3 py-2 text-xs text-do-text hover:bg-do-bg-light/50 disabled:opacity-60" disabled={savingProfile || uploadingProfileImage} onClick={onSaveProfile}>
                {savingProfile ? "Saving..." : "Save profile"}
              </button>
              {profileMessage ? <p className="text-xs text-do-text-secondary">{profileMessage}</p> : null}
            </div>
          </div>
        </section>
        {error ? <p className="text-sm text-red-500">{error}</p> : null}
        <button
          className="w-fit rounded-md bg-do-orange px-4 py-2 text-sm text-white disabled:opacity-60 hover:bg-do-orange-dark transition-colors"
          disabled={submitting || uploadingCoverImage}
          type="submit"
        >
          {submitting ? "Publishing..." : "Publish post"}
        </button>
      </form>
    </main>
  );
}

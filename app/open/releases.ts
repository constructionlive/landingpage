/* Release manifests for the apps listed on /open.

   Two apps, two manifests, because they are built by two different toolchains:
   the construction.live desktop app is an Electron build whose electron-builder
   writes latest-mac.yml, and Takeoff Beam is a Rust app whose publish script
   writes takeoff-desk/latest.json. Both live on the same public R2 bucket and
   both are fetched with a revalidate window, so a new installer shows up on
   the page without a site deploy. The parsing for the first one already lives
   in app/local/release.ts and is reused rather than copied. */

import { getRelease as getDesktopRelease, FALLBACK_DOWNLOAD_URL } from "../local/release";

const R2_BASE = "https://pub-061018a047d54079b309fb16a26a1ce0.r2.dev/";
const TAKEOFF_MANIFEST_URL = `${R2_BASE}takeoff-desk/latest.json`;

/* The buttons point at the stable `latest/` paths, which the publish script
   overwrites on every release, rather than the versioned paths the manifest
   lists. A link copied from this page into an email or a forum post then
   keeps working for the newest build instead of the one that was current
   the day it was pasted. The manifest is still read for the version line and
   the date. */
export const TAKEOFF_LATEST = {
	mac: `${R2_BASE}takeoff-desk/latest/Takeoff-Desk-arm64.dmg`,
	windows: `${R2_BASE}takeoff-desk/latest/Takeoff-Desk-x64-setup.exe`,
	film: `${R2_BASE}takeoff-desk/latest/Takeoff-Desk-launch.mp4`,
};

export const TAKEOFF_GITHUB_URL = "https://github.com/constructionlive/takeoffbeam";

export interface Build {
	url: string;
	/** Bytes, or null if unknown. */
	sizeBytes: number | null;
}

export interface AppRelease {
	version: string | null;
	/** ISO date, or null. */
	releaseDate: string | null;
	mac: Build | null;
	windows: Build | null;
}

/* The takeoff manifest carries URLs but not sizes, so the size comes from a
   HEAD on the file. It is the one number a cautious buyer reads before
   clicking, and "47 MB" against the other app's "600 MB" is part of the pitch.
   A failed HEAD just drops the size line. */
async function headSize(url: string): Promise<number | null> {
	try {
		const response = await fetch(url, { method: "HEAD", next: { revalidate: 600 } });
		if (!response.ok) return null;
		const length = response.headers.get("content-length");
		return length ? Number(length) : null;
	} catch {
		return null;
	}
}

async function getTakeoffRelease(): Promise<AppRelease> {
	const [macSize, winSize] = await Promise.all([
		headSize(TAKEOFF_LATEST.mac),
		headSize(TAKEOFF_LATEST.windows),
	]);
	const builds = {
		mac: { url: TAKEOFF_LATEST.mac, sizeBytes: macSize },
		windows: { url: TAKEOFF_LATEST.windows, sizeBytes: winSize },
	};
	try {
		const response = await fetch(TAKEOFF_MANIFEST_URL, { next: { revalidate: 600 } });
		if (!response.ok) throw new Error(`manifest ${response.status}`);
		const manifest = (await response.json()) as { version?: string; date?: string };
		return {
			version: manifest.version ?? null,
			releaseDate: manifest.date ?? null,
			...builds,
		};
	} catch (error) {
		/* The buttons do not depend on the manifest, so this only costs the
		   version line. */
		console.error("/open: could not read the Takeoff Beam manifest", error);
		return { version: null, releaseDate: null, ...builds };
	}
}

async function getAgentRelease(): Promise<AppRelease> {
	const release = await getDesktopRelease();
	return {
		version: release?.version ?? null,
		releaseDate: release?.releaseDate ?? null,
		mac: { url: release?.downloadUrl ?? FALLBACK_DOWNLOAD_URL, sizeBytes: release?.sizeBytes ?? null },
		/* Apple Silicon only today. See app/local/content.ts. */
		windows: null,
	};
}

export type ReleaseMap = Record<"agent" | "takeoff", AppRelease>;

export async function getReleases(): Promise<ReleaseMap> {
	const [agent, takeoff] = await Promise.all([getAgentRelease(), getTakeoffRelease()]);
	return { agent, takeoff };
}

export { formatSize, formatReleaseDate } from "../local/release";

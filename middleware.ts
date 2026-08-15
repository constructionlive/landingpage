import { NextResponse, type NextRequest } from "next/server";
import { GEO_HEADERS, REGION_COOKIE, regionForCountry } from "@/lib/consent";

/* Resolves the visitor's region once, at the edge, and hands it to the client
   as a cookie. Doing it here rather than with `headers()` in the root layout is
   deliberate: reading headers in a layout opts every page out of static
   generation, which this SEO-driven site can't afford. The cookie keeps pages
   static while still letting instrumentation-client.ts decide, synchronously
   and before the first event, whether it may capture anything. */
export function middleware(request: NextRequest) {
	const response = NextResponse.next();

	const country = GEO_HEADERS.reduce<string | null>(
		(found, header) => found ?? request.headers.get(header),
		null,
	);

	response.cookies.set(REGION_COOKIE, regionForCountry(country), {
		path: "/",
		sameSite: "lax",
		/* Readable by instrumentation-client.ts, so not httpOnly. It holds a
		   coarse region and no identifier, so it is a strictly-necessary cookie
		   and needs no consent itself. */
		httpOnly: false,
		secure: process.env.NODE_ENV === "production",
		maxAge: 60 * 60 * 24,
	});

	return response;
}

export const config = {
	/* Pages only. Static assets and API routes don't need the region cookie,
	   and skipping them keeps middleware off the hot path for every image. */
	matcher: [
		"/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml|webmanifest)$).*)",
	],
};

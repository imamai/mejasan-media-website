import { NextRequest, NextResponse } from "next/server";
import { getPlatformStatus } from "@/lib/website-status";

export async function middleware(request: NextRequest) {
  const platform = await getPlatformStatus();
  if (platform.status === "active") return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = "/site-status";
  url.search = "";
  url.searchParams.set("status", platform.status);
  if (platform.status_message) url.searchParams.set("message", platform.status_message);
  if (platform.maintenance_return_at) url.searchParams.set("returnAt", platform.maintenance_return_at);
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    "/((?!admin|client-portal|api|site-status|_next/static|_next/image|favicon|opengraph-image|og-image|robots.txt|sitemap.xml).*)",
  ],
};

// FILE: route.ts
// Purpose: Exposes the live installer count to the client as an uncached JSON response.
// Layer: App Router route handler
// Depends on: getInstallerCount server utility

import { NextResponse } from "next/server";

import { getInstallerCount } from "@/lib/installerCount";

export const dynamic = "force-dynamic";

// Returns the current installer total so the homepage can refresh it while open.
export async function GET() {
  const count = await getInstallerCount();

  if (count === null) {
    return NextResponse.json(
      { error: "Unable to fetch installer count." },
      {
        status: 503,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  }

  return NextResponse.json(
    { count },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );
}

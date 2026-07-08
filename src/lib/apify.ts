import type { BusinessResult, SearchParams } from "@/types";

const ACTOR_ID = (process.env.APIFY_ACTOR_ID || "compass/google-maps-scraper").replace("/", "~");

export async function runApifyActor(
  apiKey: string,
  params: SearchParams
): Promise<BusinessResult[]> {
  const searchTerms = params.subCategory
    ? [`${params.subCategory} ${params.typeOfBusiness}`]
    : [params.typeOfBusiness];

  const input = {
    searchStringsArray: searchTerms,
    locationQuery: params.location,
    maxCrawledPlacesPerSearch: params.maxResults,
    language: "en",
    deeperCityScrape: false,
    includeHistogram: false,
    includeOpeningHours: true,
    includePeopleAlsoSearch: false,
    exportPlaceUrls: false,
    additionalInfo: false,
    scrapeDirectories: false,
  };

  // Start the actor run
  const runRes = await fetch(
    `https://api.apify.com/v2/acts/${ACTOR_ID}/runs?token=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    }
  );

  if (!runRes.ok) {
    const err = await runRes.json().catch(() => ({}));
    throw new Error(
      err?.error?.message || `Apify actor start failed: ${runRes.status}`
    );
  }

  const runData = await runRes.json();
  const runId: string = runData?.data?.id;

  if (!runId) throw new Error("Failed to get run ID from Apify");

  // Poll for completion
  let status = "RUNNING";
  let attempts = 0;
  const maxAttempts = 120; // 2 minutes max

  while (status === "RUNNING" || status === "READY") {
    if (attempts >= maxAttempts) {
      throw new Error("Search timed out. Please try again.");
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));
    attempts++;

    const statusRes = await fetch(
      `https://api.apify.com/v2/actor-runs/${runId}?token=${apiKey}`
    );

    if (!statusRes.ok) continue;

    const statusData = await statusRes.json();
    status = statusData?.data?.status;
  }

  if (status !== "SUCCEEDED") {
    throw new Error(`Actor run failed with status: ${status}`);
  }

  // Fetch results
  const datasetRes = await fetch(
    `https://api.apify.com/v2/actor-runs/${runId}/dataset/items?token=${apiKey}&limit=${params.maxResults}`
  );

  if (!datasetRes.ok) {
    throw new Error("Failed to fetch results from Apify");
  }

  const results = await datasetRes.json();
  return Array.isArray(results) ? results : [];
}

export async function validateApifyKey(apiKey: string): Promise<boolean> {
  try {
    const res = await fetch(
      `https://api.apify.com/v2/users/me?token=${apiKey}`
    );
    return res.ok;
  } catch {
    return false;
  }
}

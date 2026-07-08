import type { BusinessResult, SearchParams } from "@/types";

const ACTOR_ID = (process.env.APIFY_ACTOR_ID || "compass/google-maps-scraper").replace("/", "~");

export async function runApifyActor(
  apiKey: string,
  params: SearchParams
): Promise<BusinessResult[]> {
  const isDineshsScraper = ACTOR_ID.includes("google-business-scraper");

  const input = isDineshsScraper
    ? {
        businessType: params.subCategory
          ? `${params.subCategory} ${params.typeOfBusiness}`
          : params.typeOfBusiness,
        location: params.location,
        maxResults: params.maxResults,
      }
    : {
        searchStringsArray: params.subCategory
          ? [`${params.subCategory} ${params.typeOfBusiness}`]
          : [params.typeOfBusiness],
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

  // Poll for completion or partial results
  let status = "RUNNING";
  let attempts = 0;
  const maxAttempts = 200; // ~10 minutes max polling time (200 * 3 seconds)
  let results: BusinessResult[] = [];

  while (status === "RUNNING" || status === "READY") {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    attempts++;

    // Check status
    const statusRes = await fetch(
      `https://api.apify.com/v2/actor-runs/${runId}?token=${apiKey}`
    );

    if (statusRes.ok) {
      const statusData = await statusRes.json();
      status = statusData?.data?.status;
    }

    // Try fetching dataset items so far
    const datasetRes = await fetch(
      `https://api.apify.com/v2/actor-runs/${runId}/dataset/items?token=${apiKey}&limit=${params.maxResults}`
    );

    if (datasetRes.ok) {
      const items = await datasetRes.json();
      if (Array.isArray(items) && items.length > 0) {
        results = items;
        // Stop early if we have reached the requested maxResults
        if (results.length >= params.maxResults) {
          break;
        }
      }
    }

    // Break if the run finished
    if (status !== "RUNNING" && status !== "READY") {
      break;
    }

    // If we've been polling for a while and have at least some results, return them
    if (attempts >= maxAttempts && results.length > 0) {
      break;
    }

    // If we hit the limit and still have no results, throw a timeout
    if (attempts >= maxAttempts && results.length === 0) {
      throw new Error("Search timed out. Please try again.");
    }
  }

  // If the run is still running, abort it to save your credits!
  if (status === "RUNNING" || status === "READY") {
    await fetch(
      `https://api.apify.com/v2/actor-runs/${runId}/abort?token=${apiKey}`,
      { method: "POST" }
    ).catch(() => {});
  }

  // Fetch final list if status succeeded in the meantime
  if (results.length === 0) {
    const datasetRes = await fetch(
      `https://api.apify.com/v2/actor-runs/${runId}/dataset/items?token=${apiKey}&limit=${params.maxResults}`
    );
    if (datasetRes.ok) {
      const items = await datasetRes.json();
      results = Array.isArray(items) ? items : [];
    }
  }

  return results;
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

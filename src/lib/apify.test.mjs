// Offline check of the default Actor's input and output mapping.
// Run with: node --experimental-strip-types --test src/lib/apify.test.mjs
import assert from "node:assert/strict";
import test from "node:test";

delete process.env.APIFY_ACTOR_ID;
const { runApifyActor } = await import("./apify.ts");

const place = {
  searchTerm: "vegan bakery",
  position: 1,
  title: "Sample Bakery",
  address: "1 Main St, Austin, TX 78701",
  rating: 4.6,
  ratingCount: 210,
  type: "Bakery",
  types: ["Bakery", "Vegan restaurant"],
  phoneNumber: "(512) 555-0100",
  website: "https://example.com",
  openingHours: { Monday: "7 AM-5 PM", Tuesday: "Closed" },
  cid: "123456789",
  placeId: "ChIJsample",
};

function mockFetch(items) {
  const calls = [];
  globalThis.fetch = async (url, init) => {
    calls.push({ url: String(url), body: init?.body && JSON.parse(init.body) });
    const json = String(url).includes("/runs?")
      ? { data: { id: "run1" } }
      : String(url).includes("/dataset/items")
      ? items
      : { data: { status: "SUCCEEDED" } };
    return { ok: true, json: async () => json };
  };
  return calls;
}

const params = { typeOfBusiness: "bakery", subCategory: "vegan", location: "Austin, TX", maxResults: 10 };

test("default Actor gets its own input and mapped results", async () => {
  const calls = mockFetch([place]);
  const [biz] = await runApifyActor("key", params);

  assert.match(calls[0].url, /\/acts\/johnvc~google-maps-places-api\/runs\?/);
  assert.deepEqual(calls[0].body, {
    searchTerms: ["vegan bakery"],
    location: "Austin, TX",
    maxResultsPerSearch: 20,
    language: "en",
  });
  assert.equal(biz.title, "Sample Bakery");
  assert.equal(biz.phone, "(512) 555-0100");
  assert.equal(biz.rating, 4.6);
  assert.equal(biz.reviewsCount, 210);
  assert.equal(biz.categoryName, "Bakery");
  assert.equal(biz.website, "https://example.com");
  assert.equal(biz.googleMapsUrl, "https://maps.google.com/?cid=123456789");
  assert.deepEqual(biz.openingHours, [
    { day: "Monday", hours: "7 AM-5 PM" },
    { day: "Tuesday", hours: "Closed" },
  ]);
});

test("a run with only an error row surfaces its message", async () => {
  mockFetch([{ error_message: "No places found for this search." }]);
  await assert.rejects(runApifyActor("key", params), /No places found/);
});

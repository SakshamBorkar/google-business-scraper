const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getLogs() {
  const email = "sakshamborkar23@gmail.com";

  try {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user || !user.apifyKey) {
      console.error("User or API key not found");
      return;
    }

    console.log("Fetching last run for dineshwadhwani~google-business-scraper...");
    const res = await fetch(
      `https://api.apify.com/v2/acts/dineshwadhwani~google-business-scraper/runs?limit=1&desc=true&token=${user.apifyKey}`
    );

    if (!res.ok) {
      console.error("Failed to fetch runs list:", res.status, await res.text());
      return;
    }

    const runsList = await res.json();
    const runs = runsList.data.items;

    if (!runs || runs.length === 0) {
      console.log("No runs found.");
      return;
    }

    const run = runs[0];
    console.log(`\nLatest Run Details:`);
    console.log(`ID: ${run.id}`);
    console.log(`Status: ${run.status}`);
    console.log(`Started: ${run.startedAt}`);
    console.log(`Finished: ${run.finishedAt || 'Still running'}`);

    console.log("\nFetching log for this run...");
    const logRes = await fetch(
      `https://api.apify.com/v2/actor-runs/${run.id}/log?token=${user.apifyKey}`
    );

    if (logRes.ok) {
      const logText = await logRes.text();
      const logLines = logText.split('\n');
      console.log(`Total log lines: ${logLines.length}`);
      console.log("--- End of Log (Last 40 lines) ---");
      console.log(logLines.slice(-40).join('\n'));
    } else {
      console.error("Failed to fetch run log:", logRes.status);
    }
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

getLogs();

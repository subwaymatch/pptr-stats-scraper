import puppeteer, { Browser } from "puppeteer";
import { waitForTimeout } from "@utils/browser-page";
import { PrismaClient, Prisma, School, WebsitePlatform } from "@prisma/client";
import config from "config";
import { detectWebsitePlatform } from "@utils/website-platform";

const prisma = new PrismaClient();
const MAX_RETRY_ON_FAILURE = 2;

/**
 * Scrape each school's website platform
 */
export async function scrapeAllWebsitePlatforms(): Promise<void> {
  const browser = await puppeteer.launch({
    headless: config.get("puppeteerConfig.headless"),
  });

  let results: School[] = [];
  let queryObj: Prisma.SchoolFindManyArgs = {
    take: 10,
    where: {
      AND: [
        {
          OR: [
            // { websitePlatform: WebsitePlatform.UNCHECKED },
            { websitePlatform: WebsitePlatform.UNKNOWN },
          ],
        },
        {
          url: { not: null },
        },
      ],
    },
  };

  do {
    results = await prisma.school.findMany(queryObj);

    if (results.length > 0) {
      for (const school of results) {
        await scrapeWebsitePlatform(browser, school.id);
      }

      queryObj.skip = 1;
      queryObj.cursor = {
        id: results[results.length - 1].id,
      };
    }
  } while (results.length > 0);

  await browser.close();
}

/**
 * Check and update an Athletic website's platform
 * @param browser Puppeteer Browser instance
 * @param schoolId a school's unique NCAA identifier
 * @returns school object
 */
export async function scrapeWebsitePlatform(
  browser: Browser,
  schoolId: string
): Promise<School | null> {
  // query school by ID
  let school = await prisma.school.findUniqueOrThrow({
    where: {
      id: schoolId,
    },
  });

  let retryOnFailCount = 0;
  let isSuccess = false;

  while (retryOnFailCount < MAX_RETRY_ON_FAILURE && !isSuccess) {
    const page = await browser.newPage();
    try {
      // set screen size
      await page.setViewport({ width: 1080, height: 1024 });
      // @ts-ignore
      // null urls are not returned from the prisma query
      await page.goto(school.url, {
        waitUntil: "domcontentloaded",
      });
      await waitForTimeout(1000);

      const websitePlatform = await detectWebsitePlatform(page);

      await page.close();

      if (school.websitePlatform !== websitePlatform) {
        school.websitePlatform = websitePlatform;
        await updateDatabase(school);
      }

      isSuccess = true;
    } catch (e) {
      console.error(e);
      console.log(`ERROR: retrying ${school.id}`);
      if (!page.isClosed()) {
        await page.close();
      }
      retryOnFailCount += 1;
    }
  }

  return school;
}

/**
 * Update school information
 * @param school school information
 */
async function updateDatabase(school: School): Promise<void> {
  const updatedSchool = await prisma.school.update({
    where: {
      id: school.id,
    },
    data: school,
  });

  console.log(
    `${updatedSchool.id}'s website platform has been updated to ${updatedSchool.websitePlatform}`
  );
}

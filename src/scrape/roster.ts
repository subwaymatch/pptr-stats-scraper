import puppeteer, { Page } from "puppeteer";
import { PrismaClient, Athlete, WebsitePlatform } from "@prisma/client";
import config from "config";
import { scrollToBottom, waitForTimeout } from "@utils/browser-page";
import { detectWebsitePlatform } from "@utils/website-platform";
import { getSchoolById } from "@models/schools";

const prisma = new PrismaClient();
const sportId = "soccer-women";

/**
 * Scrape women's soccer athletes within a school
 * @param browser Puppeteer Browser instance
 * @returns An array of school index information
 */
export async function scrapeRoster(
  schoolId: string,
  sportId: string
): Promise<Athlete[]> {
  const browser = await puppeteer.launch({
    headless: config.get("puppeteerConfig.headless"),
  });

  const school = await getSchoolById(schoolId);

  if (!school || !school.url) {
    const errorMsg = `${schoolId} is either missing in DB or does not have a valid Athletics website URL`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1024 });
  await page.goto(school.url, {
    waitUntil: "domcontentloaded",
  });

  await waitForTimeout(5000);

  const websitePlatform = await detectWebsitePlatform(page);

  console.log(`${schoolId} website platform: ${websitePlatform}`);

  if (websitePlatform == WebsitePlatform.SIDEARM_SPORTS) {
  }

  browser.close();

  return [];
}

/**
 * Get the URL of the next page
 * @param page puppeteer Page object
 * @returns URL of the next page or null if on the last page
 */
async function getNextPageUrl(page: Page): Promise<string | null> {
  return null;
}

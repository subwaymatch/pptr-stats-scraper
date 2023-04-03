import puppeteer, { Page } from "puppeteer";
import { scrollToBottom, waitForTimeout } from "../utils/browser-page";
import { PrismaClient, Athlete } from "@prisma/client";
import config from "config";
import { detectWebsitePlatform } from "@utils/website-platform";

const prisma = new PrismaClient();
const sportId = "soccer-women";

/**
 * Scrape women's soccer athletes within a school
 * @param browser Puppeteer Browser instance
 * @returns An array of school index information
 */
export async function scrapeRoster(schoolId: string): Promise<Athlete[]> {
  const browser = await puppeteer.launch({
    headless: config.get("puppeteerConfig.headless"),
  });

  const school = await prisma.school.findUniqueOrThrow({
    where: {
      id: schoolId,
    },
  });

  if (!school.url) {
    const errorMsg = `${schoolId} is missing a valid Athletics website URL`;
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

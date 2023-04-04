import puppeteer, { Page } from "puppeteer";
import { PrismaClient, Athlete, WebsitePlatform } from "@prisma/client";
import config from "config";
import { scrollToBottom, waitForTimeout } from "@utils/browser-page";
import { detectWebsitePlatform } from "@utils/website-platform";
import { getSchoolById } from "@models/schools";

const prisma = new PrismaClient();
const sportId = "soccer-women";

/**
 * Scrape women's soccer athletes for a specified school
 * @param schoolId a school's unique NCAA identifier
 * @returns An array of school index information
 */
export async function scrape(schoolId: string): Promise<Athlete[] | null> {
  const browser = await puppeteer.launch({
    headless: config.get("puppeteerConfig.headless"),
  });

  const school = await getSchoolById(schoolId);
  if (!school) {
    console.error(`School ID: ${schoolId} not found in database`);
    return null;
  }

  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1024 });

  const rosterUrl = new URL(
    "sports/womens-soccer/roster",
    school.url
  ).toString();
  console.log(`rosterUrl=${rosterUrl}`);
  await page.goto(rosterUrl, {
    waitUntil: "domcontentloaded",
  });
  await scrollToBottom(page);
  await waitForTimeout(2000);

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

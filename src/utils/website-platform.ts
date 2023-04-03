import { Page } from "puppeteer";
import { WebsitePlatform } from "@prisma/client";

/**
 * Detect the website's hosted platform for each Athletics website
 * @param page puppeteer Page object of a school's Athletics website
 * @returns one of the predefined website platforms
 */
export async function detectWebsitePlatform(
  page: Page
): Promise<WebsitePlatform> {
  if (await checkIfSidearmSports(page)) {
    return WebsitePlatform.SIDEARM_SPORTS;
  } else if (await checkIfPrestoSports(page)) {
    return WebsitePlatform.PRESTO_SPORTS;
  }

  return WebsitePlatform.UNKNOWN;
}

async function checkIfSidearmSports(page: Page) {
  try {
    await page.$eval('a[href*="sidearmsports.com"]', (o) => o.href);
    return true;
  } catch (e) {
    return false;
  }
}

async function checkIfPrestoSports(page: Page) {
  try {
    await page.$eval('a[href*="prestosports.com"]', (o) => o.href);
    return true;
  } catch (e) {
    return false;
  }
}

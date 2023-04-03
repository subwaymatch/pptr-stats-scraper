import { Page } from "puppeteer";
import { WebsitePlatform } from "@prisma/client";
import { scrollToBottom, waitForTimeout } from "./browser-page";

/**
 * Detect the website's hosted platform for each Athletics website
 * @param page puppeteer Page object of a school's Athletics website
 * @returns one of the predefined website platforms
 */
export async function detectWebsitePlatform(
  page: Page
): Promise<WebsitePlatform> {
  await waitForTimeout(1000);
  await scrollToBottom(page);

  if (await checkIfSidearmSports(page)) {
    return WebsitePlatform.SIDEARM_SPORTS;
  } else if (await checkIfPrestoSports(page)) {
    return WebsitePlatform.PRESTO_SPORTS;
  } else if (await checkIfStreamlineTechnologies(page)) {
    return WebsitePlatform.STREAMLINE_TECHNOLOGIES;
  } else if (await checkIfWordpress(page)) {
    return WebsitePlatform.WORDPRESS;
  } else if (await checkIfDrupal(page)) {
    return WebsitePlatform.DRUPAL;
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

async function checkIfStreamlineTechnologies(page: Page) {
  try {
    await page.$eval('a[href*="streamlinetechnologies.com"]', (o) => o.href);
    return true;
  } catch (e) {
    return false;
  }
}

async function checkIfWordpress(page: Page) {
  const content = await page.content();
  return content.includes("/wp-content/");
}

async function checkIfDrupal(page: Page) {
  try {
    const generator: string = await page.$eval(
      "meta[name=Generator]",
      (o) => o.content
    );
    return generator.toLowerCase().includes("drupal");
  } catch (e) {
    return false;
  }
}

import { Page } from "puppeteer";
import { PrismaClient, WebsitePlatform } from "@prisma/client";

declare let window: any;
declare let document: any;

/**
 * Detect the website's hosted platform for each Athletics website
 * @param page puppeteer Page object of a school's Athletics website
 * @returns one of the predefined website platforms
 */
export async function detectWebsitePlatform(
  page: Page
): Promise<WebsitePlatform> {
  return WebsitePlatform.UNKNOWN;
}

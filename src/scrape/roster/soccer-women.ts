import { Browser, Page } from "puppeteer";
import { scrollToBottom, waitForTimeout } from "../../utils/browser-page";
import { PrismaClient, Athlete } from "@prisma/client";
import fs from "fs";
import path from "path";
import { stringify } from "csv-stringify";

const prisma = new PrismaClient();

/**
 * Get all schools listed on NCAA website
 * @param browser Puppeteer Browser instance
 * @returns An array of school index information
 */
async function scrapeRoster(browser: Browser): Promise<Athlete[]> {
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

export default scrapeRoster;

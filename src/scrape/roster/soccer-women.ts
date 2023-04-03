import puppeteer, { Browser, Page } from "puppeteer";
import { scrollToBottom, waitForTimeout } from "../../utils/browser-page";
import { PrismaClient, Athlete } from "@prisma/client";
import fs from "fs";
import path from "path";
import { stringify } from "csv-stringify";
import config from "config";

const prisma = new PrismaClient();
const sportId = "soccer-women";

/**
 * Scrape women's soccer athletes within a school
 * @param browser Puppeteer Browser instance
 * @returns An array of school index information
 */
export async function scrapeAthletes(schoolId: string): Promise<Athlete[]> {
  const browser = await puppeteer.launch({
    headless: config.get("puppeteerConfig.headless"),
  });

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

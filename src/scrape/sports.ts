import puppeteer from "puppeteer";
import { PrismaClient, Sport } from "@prisma/client";
import config from "config";

const prisma = new PrismaClient();

/**
 * Get all sports listed on NCAA website
 * @returns An arry of sports and NCAA links
 */
export async function scrapeSports(): Promise<Sport[]> {
  const browser = await puppeteer.launch({
    headless: config.get("puppeteerConfig.headless"),
  });

  const page = await browser.newPage();
  const targetUrl = "https://www.ncaa.com/";

  // set screen size
  await page.setViewport({ width: 1080, height: 1024 });
  await page.goto(targetUrl, {
    waitUntil: "domcontentloaded",
  });

  let sports: Sport[] = await page.$$eval(
    ".sports-nav .season > ul > li > a",
    (links) => {
      return links.map((link) => {
        const url = link.href;

        // extract sports's slug from the URL
        // the URL appends the division if there are multiple divisions
        // such as DI, DII, DIII, etc
        // example 1: https://www.ncaa.com/sports/cross-country-men/d1
        // example 2: https://www.ncaa.com/sports/fencing
        const sportsIdRegex = /https:\/\/www\.ncaa\.com\/sports\/([\w-]+).*/;

        // use slug as the ID
        const sportsIdMatch = url.match(sportsIdRegex);
        const sportId = sportsIdMatch ? sportsIdMatch[1] : url;

        return {
          id: sportId,
          name: link.textContent ?? link.href,
          url: link.href,
        } as Sport;
      });
    }
  );

  await browser.close();

  await writeToDatabase(sports);

  return sports;
}

/**
 * Save a list of sports to database
 * @param schoolIndices List of sports
 */
async function writeToDatabase(sports: Sport[]): Promise<void> {
  const result = await prisma.sport.createMany({
    data: sports,
    skipDuplicates: true,
  });

  console.log(`${result.count} sports have been updated`);
}

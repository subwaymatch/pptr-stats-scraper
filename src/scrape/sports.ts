import { Browser } from "puppeteer";
import { PrismaClient, Sport } from "@prisma/client";
import fs from "fs";
import path from "path";
import { stringify } from "csv-stringify";

const prisma = new PrismaClient();

/**
 * Get all sports listed on NCAA website
 * @param browser Puppeteer Browser instance
 * @returns An arry of sports and NCAA links
 */
async function scrapeSports(browser: Browser): Promise<Sport[]> {
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

  await page.close();

  await writeToDatabase(sports);
  await writeToCsv(sports);

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

/**
 * Save a list of sports to a CSV file
 * @param sports List of sports
 */
async function writeToCsv(sports: Sport[]): Promise<void> {
  const outputDirectory = process.env.OUTPUT_DIR as string;

  if (!fs.existsSync(outputDirectory)) {
    fs.mkdirSync(outputDirectory);
  }

  const filename = path.join(outputDirectory, "sports.csv");

  return new Promise<void>((resolve, reject) => {
    const writableStream = fs.createWriteStream(filename, {
      flags: "w+",
    });
    const columns = ["id", "name", "url"];
    const stringifier = stringify({ header: true, columns: columns });

    sports.forEach((o) => {
      stringifier.write(o);
    });
    stringifier.end();
    stringifier.pipe(writableStream);

    writableStream.on("finish", resolve);
    writableStream.on("error", reject);

    console.log("Finished writing data");
  });
}

export default scrapeSports;

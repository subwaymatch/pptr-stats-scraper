import puppeteer from "puppeteer";
import scrapeSports from "@scrape/sports";
import scrapeSchoolIndices from "@scrape/school-indices";
import scrapeNCAASchoolProfile, {
  scrapeNCAASchoolProfiles,
} from "@scrape/ncaa-school-profile";
import dotenv from "dotenv";
import { paginateWithCursorExample } from "@scrape/test";

dotenv.config();

(async () => {
  const browser = await puppeteer.launch({ headless: true });

  // scrape list of sports
  // takes less than 30 seconds
  // await scrapeSports(browser);

  // scrape list of school indices
  // takes a few minutes
  // await scrapeSchoolIndices(browser);

  // scrape a school's NCAA profile page
  // the ID must match the id column in the School table
  // await scrapeNCAASchoolProfile(browser, "illinois");

  // pagination with cursor example
  // await paginateWithCursorExample();

  // run a sequential scraping of NCAA school profiles
  await scrapeNCAASchoolProfiles(browser);

  // close browser when done
  // await browser.close();
})();

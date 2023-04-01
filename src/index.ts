import puppeteer from "puppeteer";
import scrapeSports from "./scrape/sports";
import scrapeSchoolIndices from "./scrape/school-indices";
import dotenv from "dotenv";

dotenv.config();

(async () => {
  const browser = await puppeteer.launch({ headless: false });

  // scrape list of sports
  // await scrapeSports(browser);

  // scrape list of school indices
  await scrapeSchoolIndices(browser);

  // close browser when done
  await browser.close();
})();

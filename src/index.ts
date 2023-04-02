import puppeteer from "puppeteer";
import scrapeSports from "src/scrape/sports";
import scrapeSchoolIndices from "src/scrape/school-indices";
import dotenv from "dotenv";

dotenv.config();

(async () => {
  const browser = await puppeteer.launch({ headless: false });

  // scrape list of sports
  // takes less than 30 seconds
  // await scrapeSports(browser);

  // scrape list of school indices
  // takes a few minutes
  await scrapeSchoolIndices(browser);

  // close browser when done
  await browser.close();
})();

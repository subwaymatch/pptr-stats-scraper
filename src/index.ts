import puppeteer from "puppeteer";
import scrapeSports from "./scrape/sports";
import scrapeSchoolIndices from "./scrape/school-indices";
import dotenv from "dotenv";
import scrapeNCAASchoolProfile from "./scrape/ncaa-school-profile";

dotenv.config();

(async () => {
  const browser = await puppeteer.launch({ headless: false });

  // scrape list of sports
  // takes less than 30 seconds
  // await scrapeSports(browser);

  // scrape list of school indices
  // takes a few minutes
  await scrapeSchoolIndices(browser);

  // scrape a NCAA school profile page
  // await scrapeNCAASchoolProfile(browser, "california");

  // close browser when done
  await browser.close();
})();

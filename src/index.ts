import puppeteer from "puppeteer";
import scrapeSports from "./scrape/sports";
import scrapeSchoolIndices from "./scrape/school-indices";

(async () => {
  const browser = await puppeteer.launch({ headless: false });

  // scrape list of sports
  // await scrapeSports(browser);

  // scrape list of school indices
  await scrapeSchoolIndices(browser);
})();

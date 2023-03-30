import puppeteer from "puppeteer";
import scrapeSports from "./scrape/sports";
import scrapeSchoolIndices from "./scrape/school-indices";

(async () => {
  const browser = await puppeteer.launch({ headless: false });

  // const sports = await scrapeSports(browser);
  // console.log(sports);

  const schools = await scrapeSchoolIndices(browser);
})();

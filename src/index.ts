import { scrapeSports } from "@scrape/sports";
import { scrapeSchoolIndices } from "@scrape/school-indices";
import { scrapeAllNCAASchoolProfiles } from "@scrape/ncaa-school-profile";
import {
  scrapeAllWebsitePlatforms,
  scrapeWebsitePlatform,
} from "@scrape/athletics-website-platforms";
import { scrapeRoster } from "@scrape/roster";
import dotenv from "dotenv";
import { testQuery } from "@test-query";
import puppeteer from "puppeteer";
import config from "config";

dotenv.config();

(async () => {
  // scrape list of sports
  // await scrapeSports();

  // scrape list of school indices
  // await scrapeSchoolIndices();

  // pagination with cursor example
  // await paginateWithCursorExample();

  // run a sequential scraping of NCAA school profiles
  // await scrapeNCAASchoolProfiles();

  // scrape athletes
  // await scrapeRoster("illinois");

  // update website platform information
  await scrapeAllWebsitePlatforms();

  // const browser = await puppeteer.launch({
  //   headless: config.get("puppeteerConfig.headless"),
  // });
  // await scrapeWebsitePlatform(browser, "air-force");

  // await testQuery();

  console.log("Complete");
})();

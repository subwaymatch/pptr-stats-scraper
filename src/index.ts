import { scrapeSports } from "@scrape/sports";
import { scrapeSchoolIndices } from "@scrape/school-indices";
import { scrapeNCAASchoolProfiles } from "@scrape/ncaa-school-profile";
import dotenv from "dotenv";
import { scrapeRoster } from "@scrape/roster";

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

  console.log("Complete");
})();

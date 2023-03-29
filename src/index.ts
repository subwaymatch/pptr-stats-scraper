import puppeteer from "puppeteer";
import fs from "fs";
import scrapeSports from "./scrape/sports";

const downloadLogsFileName = "download-logs.json";
const scrapedResultDirectory = "downloaded-results";

(async () => {
  if (!fs.existsSync(scrapedResultDirectory)) {
    fs.mkdirSync(scrapedResultDirectory);
  }

  if (!fs.existsSync(downloadLogsFileName)) {
    fs.writeFileSync(downloadLogsFileName, JSON.stringify({ downloads: {} }));
  }

  const browser = await puppeteer.launch({ headless: false });

  const sports = await scrapeSports(browser);

  console.log(sports);
})();

import puppeteer, { Page } from "puppeteer";
import { scrollToBottom, waitForTimeout } from "@utils/browser-page";
import { School } from "@prisma/client";
import config from "config";
import { createSchools } from "@models/schools";

/**
 * Get all schools listed on NCAA website
 * @returns An array of school index information
 */
export async function scrapeSchoolIndices(): Promise<School[]> {
  const browser = await puppeteer.launch({
    headless: config.get("puppeteerConfig.headless"),
  });

  const page = await browser.newPage();
  let navigateUrl: string | null = "https://www.ncaa.com/schools-index";
  const elementToWaitFor = "#schools-index > table tbody tr";

  // array to hold school indices information from each page
  let schoolIndices: School[] = [];
  let numScrapedPages = 0;

  // set screen size
  await page.setViewport({ width: 1080, height: 1024 });

  do {
    await page.goto(navigateUrl, {
      waitUntil: "domcontentloaded",
    });
    await page.waitForSelector(elementToWaitFor);

    // scroll to the bottom of the page to load lazyloaded contents
    await scrollToBottom(page);

    // wait for one second for icons to load
    await waitForTimeout(1000);

    let pageSchoolIndices = await page.$$eval(
      "#schools-index > table tbody tr",
      (tableRows) => {
        return tableRows.map((tr) => {
          const schoolIconUrl = tr.cells[0].querySelector("img").src;
          const schoolName = tr.cells[2].textContent;
          const schoolIndexUrl = tr.cells[1].querySelector("a").href;

          // extract school's slug from the URL
          const schoolIdRegex = /https:\/\/www\.ncaa\.com\/schools\/([\w-]+).*/;

          // use slug as the ID
          const schoolIdMatch = schoolIndexUrl.match(schoolIdRegex);
          const schoolId = schoolIdMatch ? schoolIdMatch[1] : schoolIndexUrl;

          return {
            id: schoolId,
            iconUrl: schoolIconUrl,
            name: schoolName,
            ncaaUrl: schoolIndexUrl,
          } as School;
        });
      }
    );

    schoolIndices = schoolIndices.concat(pageSchoolIndices);
    numScrapedPages += 1;

    // if next page exists, extract URL
    navigateUrl = await getNextPageUrl(page);

    // TODO: Use the line below while testing to limit pagination
    // comment in production to scrape all pages
    // navigateUrl = numScrapedPages < 2 ? navigateUrl : null;
  } while (navigateUrl);

  await browser.close();

  console.log(`Scraped ${numScrapedPages} school index pages`);

  await createSchools(schoolIndices);

  return schoolIndices;
}

/**
 * Get the URL of the next page
 * @param page puppeteer Page object
 * @returns URL of the next page or null if on the last page
 */
async function getNextPageUrl(page: Page): Promise<string | null> {
  let nextPageLinks = await page.$$eval(".school-pager a", (anchorElements) => {
    return anchorElements
      .filter((el) => el.textContent == "Next ›")
      .map((el) => el.href as string);
  });

  const nextPageUrl = nextPageLinks.length > 0 ? nextPageLinks[0] : null;

  return nextPageUrl;
}

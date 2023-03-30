import { Browser, Page } from "puppeteer";
import { ISchoolIndex } from "../types";
import { scrollToBottom, waitForTimeout } from "../utils/page";

/**
 * Get all schools listed on NCAA website
 * @param browser Puppeteer Browser instance
 * @returns An array of school index information
 */
async function scrapeSchoolIndices(browser: Browser): Promise<ISchoolIndex[]> {
  const page = await browser.newPage();
  let currentUrl = "https://www.ncaa.com/schools-index";
  const elementToWaitFor = "#schools-index > table tbody tr";

  // array to hold school indices information from each page
  let schoolIndices: ISchoolIndex[] = [];
  let numScrapedPages = 0;

  // set screen size
  await page.setViewport({ width: 1080, height: 1024 });

  do {
    await page.goto(currentUrl, {
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
          const schoolIdRegex = /[^/]+$/;

          // @ts-ignore URL is guaranteed to have a slug
          // use slug as the school ID
          const schoolId = schoolIdRegex.exec(schoolIndexUrl)[0];

          return {
            id: schoolId,
            iconUrl: schoolIconUrl,
            name: schoolName,
            url: schoolIndexUrl,
          } as ISchoolIndex;
        });
      }
    );

    schoolIndices = schoolIndices.concat(pageSchoolIndices);
    numScrapedPages += 1;
  } while (await getNextPageUrl(page));

  // console.log(schoolIndices);

  return schoolIndices;
}

/**
 * Get the URL of the next page
 * @param page puppeteer Page object
 * @returns URL of the next page or null if on the last page
 */
async function getNextPageUrl(page: Page): Promise<string | null> {
  let nextPageLinks = await page.$$eval(
    ".school-pager aaa",
    (anchorElements) => {
      return anchorElements
        .filter((el) => el.textContent == "Next ›")
        .map((el) => el.href as string);
    }
  );

  return nextPageLinks.length > 0 ? nextPageLinks[0] : null;
}

export default scrapeSchoolIndices;

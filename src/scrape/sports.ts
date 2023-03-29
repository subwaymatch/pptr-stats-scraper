import { Browser } from "puppeteer";
import { ISport } from "../types";

/**
 * Get all sports listed on NCAA website
 * @param browser Puppeteer Browser instance
 * @returns A list of sports and NCAA links
 */
async function scrapeSports(browser: Browser): Promise<ISport[]> {
  const page = await browser.newPage();
  const targetUrl = "https://www.ncaa.com/";

  // Set screen size
  await page.setViewport({ width: 1080, height: 1024 });
  await page.goto(targetUrl, {
    waitUntil: "domcontentloaded",
  });

  let links: ISport[] = await page.$$eval(
    ".sports-nav .season > ul > li > a",
    (links) => {
      return links.map((link) => ({
        name: link.textContent ?? link.href,
        url: link.href,
      }));
    }
  );

  return links;
}

export default scrapeSports;

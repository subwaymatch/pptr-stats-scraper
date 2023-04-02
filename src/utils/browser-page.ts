import { Page } from "puppeteer";

declare let window: any;
declare let document: any;

/**
 * A utility function to scroll to the bottom of a Puppeteer page
 * This function is used to trigger lazyloaded contents in a page
 * @param page puppeteer Page object to scroll to the end
 * @see {@link https://stackoverflow.com/questions/51529332/puppeteer-scroll-down-until-you-cant-anymore}
 */
export async function scrollToBottom(page: Page) {
  await page.evaluate(async () => {
    await new Promise<void>((resolve) => {
      let totalScrolledDistance = 0;
      const scrollDistance = 100;
      const scrollDelayInMilliseconds = 100;
      const timer = setInterval(() => {
        var scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, scrollDistance);
        totalScrolledDistance += scrollDistance;

        if (totalScrolledDistance >= scrollHeight - window.innerHeight) {
          clearInterval(timer);
          resolve();
        }
      }, scrollDelayInMilliseconds);
    });
  });
}

/**
 * A utility function to wait for a given number of milliseconds
 * Replaces Puppeteer's deprecated Page.waitForTimeout() function
 * @param ms timeout duration in milliseconds
 * @see {@link https://pptr.dev/api/puppeteer.page.waitfortimeout}
 * @returns
 */
export async function waitForTimeout(ms: number): Promise<void> {
  return new Promise((res) => setTimeout(res, ms));
}

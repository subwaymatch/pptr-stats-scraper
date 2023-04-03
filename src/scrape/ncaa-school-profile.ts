import { Browser } from "puppeteer";
import { scrollToBottom, waitForTimeout } from "@utils/browser-page";
import { PrismaClient, School } from "@prisma/client";
import rgba2hex from "@utils/rgba2hex";

const prisma = new PrismaClient();

declare let window: any;

async function scrapeNCAASchoolProfiles(browser: Browser): Promise<void> {
  return;
}

/**
 * Get information from a school's NCAA profile page
 * @param browser Puppeteer Browser instance
 * @param schoolId a school's unique NCAA identifier
 * @returns school object
 */
async function scrapeNCAASchoolProfile(
  browser: Browser,
  schoolId: string
): Promise<School | null> {
  const page = await browser.newPage();
  let navigateUrl: string = `https://www.ncaa.com/schools/${schoolId}`;

  // query school by ID
  let school = await prisma.school.findUnique({
    where: {
      id: schoolId,
    },
  });

  // if school ID is not found in DB, do nothing and return null
  if (!school) {
    console.error(`School ID: ${schoolId} not found in database`);
    return null;
  }

  console.log(school);

  // set screen size
  await page.setViewport({ width: 1080, height: 1024 });

  await page.goto(navigateUrl, {
    waitUntil: "domcontentloaded",
  });

  school.divisionLocation = await page.$eval(
    ".division-location",
    (el) => el.innerText
  );

  // school details in <dl> (description list) element
  const schoolDetails = await page.$$eval(
    ".school-details > .dl-group",
    (dlGroups) => {
      return dlGroups.reduce((schoolDetails, dlGroupEl) => {
        const k = dlGroupEl.querySelector("dt").textContent.toLowerCase();
        const v = dlGroupEl.querySelector("dd").textContent;

        schoolDetails[k] = v;

        return schoolDetails;
      }, {});
    }
  );

  ["conference", "nickname", "colors"].forEach((key) => {
    // @ts-ignore
    // false flag - school has already been null-checked
    if (school.hasOwnProperty(key)) {
      // @ts-ignore
      school[key] = schoolDetails[key];
    }
  });

  // school links in <div class="school links" />
  const schoolLinks = await page.$$eval(
    ".school-links ul > li > a",
    (linkEls) => {
      return linkEls.reduce((schoolLinks, el) => {
        if (el.querySelector("span.icon-web")) {
          schoolLinks["url"] = el.href;
        } else if (el.querySelector("span.icon-twitter")) {
          schoolLinks["twitterUrl"] = el.href;
        } else if (el.querySelector("span.icon-facebook")) {
          schoolLinks["facebookUrl"] = el.href;
        }

        return schoolLinks;
      }, {});
    }
  );

  ["url", "twitterUrl", "facebookUrl"].forEach((key) => {
    // @ts-ignore
    // false flag - school has already been null-checked
    if (school.hasOwnProperty(key)) {
      // @ts-ignore
      school[key] = schoolLinks[key];
    }
  });

  // school backgorund color
  let bgColor = await page.$eval(".school-header", (el) =>
    window.getComputedStyle(el).getPropertyValue("background-color")
  );
  bgColor = rgba2hex(bgColor);
  school.bgColor = bgColor;

  page.close();

  await updateDatabase(school);
  await waitForTimeout(1000);

  return school;
}

/**
 * Update school information
 * @param school school information
 */
async function updateDatabase(school: School): Promise<void> {
  const updatedSchool = await prisma.school.update({
    where: {
      id: school.id,
    },
    data: school,
  });

  console.log(
    `${updatedSchool.id}'s NCAA profile information has been updated`
  );
}

export default scrapeNCAASchoolProfile;

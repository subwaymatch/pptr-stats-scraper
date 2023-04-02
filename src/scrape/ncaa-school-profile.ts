import { Browser } from "puppeteer";
import { scrollToBottom, waitForTimeout } from "@utils/browser-page";
import { PrismaClient, School } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Get all schools listed on NCAA website
 * @param browser Puppeteer Browser instance
 * @param schoolId a school's unique NCAA identifier
 * @returns An array of school index information
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
      return dlGroups.reduce((schoolDetails, dlGroup) => {
        const k = dlGroup.querySelector("dt").textContent.toLowerCase();
        const v = dlGroup.querySelector("dd").textContent;

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

  page.close();

  // await updateDatabase(school);

  console.log(school);

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

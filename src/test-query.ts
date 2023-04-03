import { Prisma, PrismaClient, School, WebsitePlatform } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * For testing only
 */
export async function testQuery() {
  let results: School[] = [];
  let queryObj: Prisma.SchoolFindManyArgs = {
    where: {
      AND: [
        {
          OR: [
            { websitePlatform: WebsitePlatform.UNCHECKED },
            { websitePlatform: WebsitePlatform.UNKNOWN },
          ],
        },
        {
          url: { not: null },
        },
      ],
    },
  };

  results = await prisma.school.findMany(queryObj);

  console.log(results.length);
}

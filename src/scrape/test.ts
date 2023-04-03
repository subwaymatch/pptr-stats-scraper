import { PrismaClient, Prisma, Sport } from "@prisma/client";
import { waitForTimeout } from "@utils/browser-page";

const prisma = new PrismaClient();

export async function paginateWithCursorExample() {
  let results: Sport[] = [];
  let queryObj: Prisma.SportFindManyArgs = {
    take: 10,
  };

  do {
    results = await prisma.sport.findMany(queryObj);

    if (results.length > 0) {
      queryObj.skip = 1;
      queryObj.cursor = {
        id: results[results.length - 1].id,
      };
    }

    for (const o of results) {
      console.log(o.id);

      // add timeout
      await waitForTimeout(1000);
    }
  } while (results.length > 0);

  console.log(`paginate query complete`);
}

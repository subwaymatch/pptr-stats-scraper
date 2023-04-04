import { PrismaClient, Sport } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Create a list of sports to database
 * @param schoolIndices List of sports
 */
export async function createSports(sports: Sport[]): Promise<void> {
  const result = await prisma.sport.createMany({
    data: sports,
    skipDuplicates: true,
  });

  console.log(`${result.count} sports have been created`);
}

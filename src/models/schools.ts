import { PrismaClient, School } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Retrieve a school object by school ID
 * @param schoolId a unique NCAA identifier for a school
 * @returns
 */
export async function getSchoolById(schoolId: string): Promise<School | null> {
  // query school by ID
  let school = await prisma.school.findUnique({
    where: {
      id: schoolId,
    },
  });

  return school;
}

/**
 * Create an array of schools' information
 * @param schools an array of schools
 */
export async function createSchools(schools: School[]): Promise<void> {
  const result = await prisma.school.createMany({
    data: schools,
    skipDuplicates: true,
  });

  console.log(`${result.count} schools have been created`);
}

/**
 * Update school information
 * @param school school information
 */
export async function updateSchool(school: School): Promise<void> {
  const updatedSchool = await prisma.school.update({
    where: {
      id: school.id,
    },
    data: school,
  });

  console.log(`${updatedSchool.id}'s school information has been updated`);
}

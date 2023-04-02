# pptr-stats-scraper

This project uses [Puppeteer](https://pptr.dev/) to scrape data.

## Requirements

- [Node.js](https://nodejs.org/) version 18 or higher
- Postgres database
  - This project uses PostgreSQL instance running on [AWS RDS](https://aws.amazon.com/rds/) `db.t3.micro`.
  - However, other databases supported by [Prisma Client](https://www.prisma.io/client) can be used (MySQL, SQL Server, or MongoDB) as well.
  - SQLite cannot be used due to the lack of `createMany()` API. See [this GitHub issue](https://github.com/prisma/prisma/issues/10710) for a related discussion.

### `DATABASE_URL` environment variable

Create an `.env` file in the root directory and add a database connection URL.

```
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
```

## Run scraping

`npm start` will compile the Typescript files and run the main file (`index.js`).

```bash
$ npm start
```

## Prisma

[Prisma Client](https://www.prisma.io/client) is used to simplify database access and ensure type safety.

[Prisma Schema](https://www.prisma.io/client) uses a declarative data modeling approach. Anyone who joins the project later can understand the application model by looking at the schema. All data models are defined in Prisma's main configuration file (`prisma/schema.prisma`)

Here is a graphical illustration of the typical workflow for the Prisma Client (from [Prisma Client docs](https://www.prisma.io/docs/concepts/components/prisma-client/working-with-prismaclient/generating-prisma-client)):

![image](https://user-images.githubusercontent.com/1064036/229275903-c3006f99-fc48-4ce7-97a4-306f0dea3c09.png)

### Generate client

After making any changes to the `prisma/schema.prisma` file, run the `generate` command to update client files and types.

```bash
$ npx prisma generate
```

### Apply migrations

```bash
$ npx prisma migrate dev --name your-migration-name
```

Alternatively, push the changes to the database without creating a migration.

```bash
# push schema to database without creating a migration entry
$ npx prisma db push

# connect database and add Prisma models to local schema
$ npx prisma db pull
```

## Notes

- Most athletics websites are powered by [SIDEARM Sports (by LEARFIELD)](https://sidearmsports.com/).
  - These sites have similar URL structure.
- Some athletics websites are powered by different platforms.
  - Example: https://www.catholicathletics.com/ is powered by [Presto Sports](http://www.prestosports.com/).
- Some links listed on NCAA are outdated.
  - Example: [NCAA's Cheyney University of Pennsylvania page](https://www.ncaa.com/schools/cheyney) lists http://cheyneywolves.com/ as the athletics website. However, the correct URL is https://cheyneyathletics.com/.

### Questions

- Can an athlete switch sports?
- Can an athlete play two or more sports?
  - In other words, is player-to-sport always a one-to-one relationship?

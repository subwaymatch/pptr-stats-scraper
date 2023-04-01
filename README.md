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

## Prisma

[Prisma Client](https://www.prisma.io/client) is used to simplify database access and ensure type safety.

[Prisma Schema](https://www.prisma.io/client) uses a declarative data modeling approach. Anyone who joins the project later can understand the application model by looking at the schema. All data models are defined in Prisma's main configuration file (`prisma/schema.prisma`)

Here is a graphical illustration of the typical workflow for the Prisma Client (from [Prisma Client docs](https://www.prisma.io/docs/concepts/components/prisma-client/working-with-prismaclient/generating-prisma-client)):

![image](https://user-images.githubusercontent.com/1064036/229275903-c3006f99-fc48-4ce7-97a4-306f0dea3c09.png)

### Apply migrations

```
npx prisma migrate dev --name your-migration-name
```

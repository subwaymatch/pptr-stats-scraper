# pptr-stats-scraper

This project uses [Puppeteer](https://pptr.dev/) to scrape data.

## Requirements

- [Node.js](https://nodejs.org/) version 18 or higher
- Postgres database
  - Any other databases supported by [Prisma Client](https://www.prisma.io/client) can be used (MySQL, sqlite, SQL Server, or MongoDB).
  - PostgreSQL instance running on [AWS RDS](https://aws.amazon.com/rds/) t3g.micro is used.

### `DATABASE_URL` environment variable

Create an `.env` file in the root directory and add a database connection URL.

```
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
```

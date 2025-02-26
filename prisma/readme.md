# Prisma Schema Setup & Database Reset Guide

## Table of Contents
1. [Setting Up Prisma Schema](#setting-up-prisma-schema)
    - [Install Prisma CLI and Prisma Client](#install-prisma-cli-and-prisma-client)
    - [Initialize Prisma](#initialize-prisma)
    - [Define Your Data Model](#define-your-data-model)
    - [Generate Prisma Client](#generate-prisma-client)
    - [Push the Schema to the Database](#push-the-schema-to-the-database)
2. [Resetting the Database](#resetting-the-database)
    - [Reset the Database](#reset-the-database)
    - [Re-generate Prisma Client](#re-generate-prisma-client)
    - [Push the Schema Again](#push-the-schema-again)
3. [Additional Notes](#additional-notes)

## Setting Up Prisma Schema

Follow these steps to set up Prisma in your project:

### Install Prisma CLI and Prisma Client

Run the following command to install Prisma:

```sh
npm install @prisma/cli @prisma/client
```
### Initialize Prisma

Initialize Prisma in your project with:

```sh
npx prisma init
```

### Define Your Data Model

Edit the schema.prisma file and define your database models.

### Generate Prisma Client

Run this command to generate the Prisma Client:

```sh
npx prisma generate
```
### Push the Schema to the Database

To apply your schema changes to the database, use:
```sh
npx prisma db push
```
---

## Resetting the Database

If you need to reset your database, follow these steps:

### Reset the Database

This will delete all data and apply migrations:

```sh
npx prisma migrate reset
```

### Re-generate Prisma Client

Run the following command:
```sh
npx prisma generate
```

### Push the Schema Again

Re-apply the schema to the database:

```sh
npx prisma db push
```

---

## Additional Notes

- 📊 Use `npx prisma studio` to visually inspect your database in Prisma Studio.
- 🚀 For migrations, use `npx prisma migrate dev` instead of `db push`.
- 📚 Refer to the [Prisma Documentation](https://www.prisma.io/docs/) for more details.


## Project Summary

The Next.js 15 App Router is a powerful tool that enables the creation of complex client-side routing in Next.js applications. This project leverages the Next.js 15 App Router to build a fully functional E-Commerce platform with an Admin Dashboard, providing seamless navigation and an enhanced user experience.

## Table of Contents

- [Project Summary](#project-summary)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Plugins and Setup](#plugins-and-setup)
- [Running Tests](#running-tests)

## **![Getting Started](https://img.shields.io/badge/Getting%20Started-2D3748?style=for-the-badge&logo=rocket&logoColor=white)**

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## **![Project Structure](https://img.shields.io/badge/Project%20Structure-2D3748?style=for-the-badge&logo=structure&logoColor=white)**

The project is organized into several key directories and files:

- `app/`: Contains the main application components and pages.
- `components/`: Reusable UI components.
- `lib/`: Utility functions and libraries.
- `pages/`: Traditional Next.js pages.
- `public/`: Static assets like images and fonts.
- `styles/`: Global styles and CSS files.
- `prisma/`: Prisma schema and migration files.

## **![Plugins and Setup](https://img.shields.io/badge/Plugins%20and%20Setup-2D3748?style=for-the-badge&logo=plugin&logoColor=white)**

This project uses several plugins to enhance functionality. Below are the plugins and steps to set them up:

1. **![Clerk](https://img.shields.io/badge/Clerk-2D3748?style=for-the-badge&logo=clerk&logoColor=white)**:

- Install: `npm install @clerk/clerk-sdk-node`
- Setup: Follow the [Clerk documentation](https://docs.clerk.dev/) to configure authentication.

2. **![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)** : 

- Setup: Follow the [Prisma documentation](prisma/readme.md) to configure your database and generate the Prisma client.

3. **![Axios](https://img.shields.io/badge/Axios-2D3748?style=for-the-badge&logo=axios&logoColor=white)**:

- Install: `npm install axios`
- Setup: Follow the [Axios documentation](https://axios-http.com/docs/intro) to configure HTTP requests.

4. **![Next Cloudinary](https://img.shields.io/badge/Next%20Cloudinary-2D3748?style=for-the-badge&logo=cloudinary&logoColor=white)**:

- Install: `npm install next-cloudinary`
- Setup: Follow the [Next Cloudinary documentation](https://next-cloudinary.spacejelly.dev/) to configure image handling.

5. **![Zod](https://img.shields.io/badge/Zod-2D3748?style=for-the-badge&logo=zod&logoColor=white)**:

- Install: `npm install zod`
- Setup: Follow the [Zod documentation](https://zod.dev/) to configure schema validation.

6. **![Zustand](https://img.shields.io/badge/Zustand-2D3748?style=for-the-badge&logo=zustand&logoColor=white)**:

- Install: `npm install zustand`
- Setup: Follow the [Zustand documentation](https://docs.pmnd.rs/zustand/getting-started/introduction) to configure state management.



## **![Running Tests](https://img.shields.io/badge/Tests-2D3748?style=for-the-badge&logo=testing-library&logoColor=white)** //TODO Move this inside test folder and map it back

This project uses Cypress for end-to-end testing and Thunder Client for API testing.

1. **![Cypress](https://img.shields.io/badge/Cypress-2D3748?style=for-the-badge&logo=cypress&logoColor=white)**:
- Install: `npm install cypress`
- Setup: Run `npx cypress open` to open the Cypress test runner.
- Write tests in the `cypress/integration` directory.

2. **![Thunder Client](https://img.shields.io/badge/Thunder%20Client-2D3748?style=for-the-badge&logo=thunder-client&logoColor=white)**:
- Install: Thunder Client is a VSCode extension. Install it from the VSCode marketplace.
- Setup: Create and manage API requests directly within VSCode using Thunder Client.
- Write tests in the Thunder Client interface within VSCode.

Run the tests using the following command:

```bash
npm run test
```

This will execute all the configured tests and provide a report of the results.



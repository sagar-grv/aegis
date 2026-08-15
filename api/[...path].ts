import { createAegisExpressApp } from "../server/_core/app";

/** Vercel maps every /api/* request to the existing Express API surface. */
const app = createAegisExpressApp();

export default app;

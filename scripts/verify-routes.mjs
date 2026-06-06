import { readText } from "./check-utils.mjs";

const router = await readText("src/app/router.tsx");
const requiredRoutes = ["/", "/login", "/signup", "/dashboard", "/scan/new", "/scan/processing/:scanId", "/scan/results/:scanId", "/scan/history", "/scan/editor/:scanId", "/scan/editor/:scanId/summary"];
const missing = requiredRoutes.filter((route) => !router.includes(`path: "${route}"`));

if (missing.length) {
  console.error(`Missing routes: ${missing.join(", ")}`);
  process.exit(1);
}

console.log(`Route verification passed: ${requiredRoutes.join(", ")}`);

import { mkdir, copyFile, rm, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { listFiles } from "./check-utils.mjs";

await rm("dist", { recursive: true, force: true });
await mkdir("dist", { recursive: true });
await copyFile("index.html", "dist/index.html");

const files = await listFiles("src", [".js", ".ts", ".css"]);
for (const file of files) {
  const out = join("dist", file);
  await mkdir(dirname(out), { recursive: true });
  await copyFile(file, out);
}

const html = await readFile("dist/index.html", "utf8");
await writeFile("dist/index.html", html.replace("/src/styles/main.css", "./src/styles/main.css").replace("/src/main.js", "./src/main.js"));
console.log(`Build complete (${files.length + 1} files).`);

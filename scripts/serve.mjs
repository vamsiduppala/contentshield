import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join } from "node:path";

const port = Number(process.env.PORT || 4173);
const types = new Map([
  [".html", "text/html"],
  [".js", "text/javascript"],
  [".css", "text/css"],
  [".ts", "text/plain"]
]);

createServer(async (request, response) => {
  const url = new URL(request.url, `http://localhost:${port}`);
  const path = url.pathname === "/" ? "index.html" : url.pathname.slice(1);
  const file = path.startsWith("src/") ? path : "index.html";

  try {
    const content = await readFile(join(process.cwd(), file));
    response.writeHead(200, { "Content-Type": types.get(extname(file)) || "text/plain" });
    response.end(content);
  } catch {
    response.writeHead(404);
    response.end("Not found");
  }
}).listen(port, () => {
  console.log(`ContentShield AI FE-1 running at http://localhost:${port}`);
});

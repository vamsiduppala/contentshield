import { readFile, readdir, stat } from "node:fs/promises";
import { extname, join } from "node:path";

export async function listFiles(dir, extensions) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return listFiles(path, extensions);
    return extensions.includes(extname(entry.name)) ? [path] : [];
  }));
  return files.flat();
}

export async function readText(path) {
  return readFile(path, "utf8");
}

export async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

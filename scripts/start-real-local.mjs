import { spawn } from "node:child_process";
import { createWriteStream, existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const nodePath = "C:\\Users\\vamsi\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\node\\bin";
const pathValue = `${nodePath};${process.env.PATH || ""}`;

function readEnv(file) {
  if (!existsSync(file)) return {};
  return Object.fromEntries(
    readFileSync(file, "utf8")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#") && line.includes("="))
      .map((line) => {
        const index = line.indexOf("=");
        return [line.slice(0, index), line.slice(index + 1).replace(/^"|"$/g, "")];
      })
  );
}

function start(name, command, args, cwd, env) {
  const log = createWriteStream(join(root, `${name}.log`), { flags: "a" });
  const child = spawn(command, args, {
    cwd,
    env: { ...process.env, ...env, PATH: pathValue },
    windowsHide: true,
    detached: false,
    stdio: ["ignore", "pipe", "pipe"]
  });
  child.stdout.pipe(log);
  child.stderr.pipe(log);
  child.on("exit", (code) => {
    log.write(`\n${name} exited with code ${code}\n`);
  });
  console.log(`${name} pid ${child.pid}`);
  return child;
}

const backendEnv = {
  ...readEnv(join(root, "backend", ".env")),
  MOCK_AI_MODE: "false",
  PORT: "4000"
};

start("backend-real", "node", ["dist/src/main.js"], join(root, "backend"), backendEnv);
start("frontend-real", "cmd.exe", ["/c", join(root, "node_modules", ".bin", "vite.CMD"), "preview", "--config", "vite.config.mjs", "--configLoader", "native", "--host", "127.0.0.1", "--port", "4173", "--strictPort"], root, {});

setInterval(() => {}, 60_000);

import fs from "fs";
import path from "path";
import { DB } from "./types";

const isVercel = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const baseDir = isVercel ? "/tmp" : process.cwd();
const file = path.join(baseDir, "data", "db.json");
const sourceFile = path.join(process.cwd(), "data", "db.json");

const empty: DB = { users: [], follows: [], posts: [] };

function ensureFile() {
  if (!fs.existsSync(file)) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    if (fs.existsSync(sourceFile) && file !== sourceFile) {
      try {
        fs.copyFileSync(sourceFile, file);
        return;
      } catch {}
    }
    fs.writeFileSync(file, JSON.stringify(empty, null, 2));
  }
}

export function readDB(): DB {
  try {
    ensureFile();
    return JSON.parse(fs.readFileSync(file, "utf8")) as DB;
  } catch {
    return { ...empty };
  }
}

export function writeDB(db: DB) {
  try {
    ensureFile();
    fs.writeFileSync(file, JSON.stringify(db, null, 2));
  } catch (err) {
    console.error("writeDB error:", err);
  }
}


import fs from "fs";
import path from "path";
import { DB } from "./types";

const file = path.join(process.cwd(), "data", "db.json");

const empty: DB = { users: [], follows: [], posts: [] };

export function readDB(): DB {
  try {
    if (!fs.existsSync(file)) {
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, JSON.stringify(empty, null, 2));
      return { ...empty };
    }
    return JSON.parse(fs.readFileSync(file, "utf8")) as DB;
  } catch {
    return { ...empty };
  }
}

export function writeDB(db: DB) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(db, null, 2));
}

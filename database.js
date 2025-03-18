// database.js
import Database from "better-sqlite3";
const db = new Database("./data.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    language TEXT,
    responses TEXT,
    documentPath TEXT,
    income INTEGER,
    employmentDuration INTEGER,
    existingLoans INTEGER,
    result TEXT
  )
`);

export default db;
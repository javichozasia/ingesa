import Database from 'better-sqlite3';
import path from 'path';

const db = new Database('ingesa.db');

// Initialize table
db.exec(`
  CREATE TABLE IF NOT EXISTS preguntas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tema TEXT NOT NULL,
    pregunta TEXT NOT NULL,
    opcion_a TEXT NOT NULL,
    opcion_b TEXT NOT NULL,
    opcion_c TEXT NOT NULL,
    opcion_d TEXT NOT NULL,
    correcta TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_tema ON preguntas(tema);
`);

export default db;

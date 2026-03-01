import express from "express";
import { createServer as createViteServer } from "vite";
import db from "./src/db.ts";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Auto-seeding
  const count = db.prepare("SELECT COUNT(*) as count FROM preguntas").get() as { count: number };
  if (count.count === 0) {
    console.log("Database empty, seeding...");
    try {
      await import("./seed.ts");
      await import("./seed2.ts");
      await import("./seed3.ts");
      await import("./seed4.ts");
      console.log("Seeding complete.");
    } catch (err) {
      console.error("Seeding failed:", err);
    }
  }

  // API Routes
  app.get("/api/temas", (req, res) => {
    try {
      const temas = db.prepare("SELECT tema, COUNT(*) as total FROM preguntas GROUP BY tema").all();
      const totalGeneral = db.prepare("SELECT COUNT(*) as total FROM preguntas").get() as { total: number };
      res.json({ temas, totalGeneral: totalGeneral.total });
    } catch (error) {
      res.status(500).json({ error: "Error fetching themes" });
    }
  });

  app.get("/api/preguntas", (req, res) => {
    const { tema, cantidad } = req.query;
    try {
      let preguntas;
      if (tema && tema !== "GENERAL") {
        preguntas = db.prepare("SELECT * FROM preguntas WHERE tema = ? ORDER BY RANDOM()").all(tema);
      } else {
        const limit = cantidad ? parseInt(cantidad as string) : 1000;
        preguntas = db.prepare("SELECT * FROM preguntas ORDER BY RANDOM() LIMIT ?").all(limit);
      }
      res.json(preguntas);
    } catch (error) {
      res.status(500).json({ error: "Error fetching questions" });
    }
  });

  app.post("/api/preguntas", (req, res) => {
    const { tema, pregunta, opcion_a, opcion_b, opcion_c, opcion_d, correcta } = req.body;
    try {
      const stmt = db.prepare(
        "INSERT INTO preguntas (tema, pregunta, opcion_a, opcion_b, opcion_c, opcion_d, correcta) VALUES (?, ?, ?, ?, ?, ?, ?)"
      );
      const info = stmt.run(tema, pregunta, opcion_a, opcion_b, opcion_c, opcion_d, correcta);
      res.json({ id: info.lastInsertRowid });
    } catch (error) {
      res.status(500).json({ error: "Error saving question" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

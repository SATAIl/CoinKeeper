import { Router } from "express";
import { db, nextCategoryId } from "../storage/db";
import { Category } from "../models/category";

const router = Router();

router.get("/category", (_req, res) => {
  res.json(db.categories);
});

router.post("/category", (req, res) => {
  const { name } = req.body as { name?: string };

  if (!name) {
    return res.status(400).json({ error: "Field 'name' is required" });
  }

  const category: Category = {
    id: nextCategoryId(),
    name
  };

  db.categories.push(category);
  res.status(201).json(category);
});

router.delete("/category/:categoryId", (req, res) => {
  const id = Number(req.params.categoryId);
  const index = db.categories.findIndex((c) => c.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Category not found" });
  }

  db.categories.splice(index, 1);
  db.records = db.records.filter((r) => r.categoryId !== id);

  res.status(204).send();
});

export default router;

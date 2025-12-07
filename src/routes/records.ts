import { Router } from "express";
import { db, nextRecordId } from "../storage/db";
import { Record } from "../models/record";

const router = Router();

router.get("/record/:recordId", (req, res) => {
  const id = Number(req.params.recordId);
  const record = db.records.find((r) => r.id === id);

  if (!record) {
    return res.status(404).json({ error: "Record not found" });
  }

  res.json(record);
});

router.post("/record", (req, res) => {
  const { userId, categoryId, amount } = req.body as {
    userId?: number;
    categoryId?: number;
    amount?: number;
  };

  if (
    typeof userId !== "number" ||
    typeof categoryId !== "number" ||
    typeof amount !== "number"
  ) {
    return res.status(400).json({
      error: "Fields 'userId', 'categoryId' and 'amount' must be numbers"
    });
  }

  const user = db.users.find((u) => u.id === userId);
  const category = db.categories.find((c) => c.id === categoryId);

  if (!user) {
    return res.status(400).json({ error: "User does not exist" });
  }

  if (!category) {
    return res.status(400).json({ error: "Category does not exist" });
  }

  const record: Record = {
    id: nextRecordId(),
    userId,
    categoryId,
    createdAt: new Date().toISOString(),
    amount
  };

  db.records.push(record);
  res.status(201).json(record);
});

router.get("/record", (req, res) => {
  const { user_id, category_id } = req.query as {
    user_id?: string;
    category_id?: string;
  };

  if (!user_id && !category_id) {
    return res.status(400).json({
      error: "At least one of 'user_id' or 'category_id' must be provided"
    });
  }

  let result = db.records;

  if (user_id) {
    const userId = Number(user_id);
    result = result.filter((r) => r.userId === userId);
  }

  if (category_id) {
    const categoryId = Number(category_id);
    result = result.filter((r) => r.categoryId === categoryId);
  }

  res.json(result);
});

router.delete("/record/:recordId", (req, res) => {
  const id = Number(req.params.recordId);
  const index = db.records.findIndex((r) => r.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Record not found" });
  }

  db.records.splice(index, 1);
  res.status(204).send();
});

export default router;

import { Router } from "express";
import { db, nextUserId } from "../storage/db";
import { User } from "../models/user";

const router = Router();

router.get("/users", (_req, res) => {
  res.json(db.users);
});

router.get("/user/:userId", (req, res) => {
  const id = Number(req.params.userId);
  const user = db.users.find((u) => u.id === id);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json(user);
});

router.post("/user", (req, res) => {
  const { name } = req.body as { name?: string };

  if (!name) {
    return res.status(400).json({ error: "Field 'name' is required" });
  }

  const newUser: User = {
    id: nextUserId(),
    name
  };

  db.users.push(newUser);
  res.status(201).json(newUser);
});

router.delete("/user/:userId", (req, res) => {
  const id = Number(req.params.userId);
  const index = db.users.findIndex((u) => u.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "User not found" });
  }

  db.users.splice(index, 1);
  db.records = db.records.filter((r) => r.userId !== id);

  res.status(204).send();
});

export default router;

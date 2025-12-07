import { Router } from "express";
import { prisma } from "../db/prisma";
import { validateBody } from "../middleware/validate";
import { createUserSchema } from "../schemas/user";

const router = Router();

// GET /users
router.get("/users", async (_req, res, next) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (err) {
    next(err);
  }
});

// GET /user/:userId
router.get("/user/:userId", async (req, res, next) => {
  try {
    const id = Number(req.params.userId);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid user id" });
    }

    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (err) {
    next(err);
  }
});

// POST /user
router.post(
  "/user",
  validateBody(createUserSchema),
  async (req, res, next) => {
    try {
      const { name } = req.body;
      const user = await prisma.user.create({
        data: { name },
      });
      res.status(201).json(user);
    } catch (err) {
      next(err);
    }
  }
);

// DELETE /user/:userId
router.delete("/user/:userId", async (req, res, next) => {
  try {
    const id = Number(req.params.userId);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid user id" });
    }

    await prisma.record.deleteMany({
      where: { userId: id },
    });

    const deleted = await prisma.user.delete({
      where: { id },
    });

    if (!deleted) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(204).send();
  } catch (err: any) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "User not found" });
    }
    next(err);
  }
});

export default router;

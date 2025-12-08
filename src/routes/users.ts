import { Router } from "express";
import { prisma } from "../db/prisma";

const router = Router();

// GET /users - list all users (protected by JWT middleware)
router.get("/users", async (_req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        username: true,
      },
    });

    res.json(users);
  } catch (err) {
    next(err);
  }
});

// DELETE /user/:userId - delete user by id (protected)
router.delete("/user/:userId", async (req, res, next) => {
  try {
    const id = Number(req.params.userId);

    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid user id" });
    }

    try {
      await prisma.user.delete({
        where: { id },
      });
    } catch (err: any) {
      if (err.code === "P2025") {
        return res.status(404).json({ error: "User not found" });
      }
      throw err;
    }

    return res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;

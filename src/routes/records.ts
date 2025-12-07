import { Router } from "express";
import { prisma } from "../db/prisma";
import { validateBody } from "../middleware/validate";
import { createRecordSchema } from "../schemas/record";

const router = Router();

// GET /record/:recordId
router.get("/record/:recordId", async (req, res, next) => {
  try {
    const id = Number(req.params.recordId);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid record id" });
    }

    const record = await prisma.record.findUnique({
      where: { id },
    });

    if (!record) {
      return res.status(404).json({ error: "Record not found" });
    }

    res.json(record);
  } catch (err) {
    next(err);
  }
});

// POST /record
router.post(
  "/record",
  validateBody(createRecordSchema),
  async (req, res, next) => {
    try {
      const { userId, categoryId, amount } = req.body as {
        userId: number;
        categoryId: number;
        amount: number;
      };

      const user = await prisma.user.findUnique({
        where: { id: userId },
      });
      if (!user) {
        return res.status(400).json({ error: "User does not exist" });
      }

      const category = await prisma.category.findUnique({
        where: { id: categoryId },
      });
      if (!category) {
        return res.status(400).json({ error: "Category does not exist" });
      }

      const record = await prisma.record.create({
        data: {
          userId,
          categoryId,
          amount,
        },
      });

      res.status(201).json(record);
    } catch (err) {
      next(err);
    }
  }
);

// GET /record?user_id=&category_id=
router.get("/record", async (req, res, next) => {
  try {
    const userIdParam = req.query.user_id as string | undefined;
    const categoryIdParam = req.query.category_id as string | undefined;

    if (!userIdParam && !categoryIdParam) {
      return res.status(400).json({
        error: "At least one of 'user_id' or 'category_id' must be provided",
      });
    }

    const where: any = {};

    if (userIdParam) {
      const userId = Number(userIdParam);
      if (Number.isNaN(userId)) {
        return res.status(400).json({ error: "Invalid user_id" });
      }
      where.userId = userId;
    }

    if (categoryIdParam) {
      const categoryId = Number(categoryIdParam);
      if (Number.isNaN(categoryId)) {
        return res.status(400).json({ error: "Invalid category_id" });
      }
      where.categoryId = categoryId;
    }

    const records = await prisma.record.findMany({ where });
    res.json(records);
  } catch (err) {
    next(err);
  }
});

// DELETE /record/:recordId
router.delete("/record/:recordId", async (req, res, next) => {
  try {
    const id = Number(req.params.recordId);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid record id" });
    }

    const deleted = await prisma.record.delete({
      where: { id },
    });

    if (!deleted) {
      return res.status(404).json({ error: "Record not found" });
    }

    res.status(204).send();
  } catch (err: any) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Record not found" });
    }
    next(err);
  }
});

export default router;

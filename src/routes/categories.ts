import { Router } from "express";
import { prisma } from "../db/prisma";
import { validateBody } from "../middleware/validate";
import { createCategorySchema } from "../schemas/category";

const router = Router();

// GET /category
// ?user_id=1 -> global + user-specific categories
router.get("/category", async (req, res, next) => {
  try {
    const userIdParam = req.query.user_id as string | undefined;

    if (!userIdParam) {
      const categories = await prisma.category.findMany({
        where: { isGlobal: true },
      });
      return res.json(categories);
    }

    const userId = Number(userIdParam);
    if (Number.isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user_id" });
    }

    const categories = await prisma.category.findMany({
      where: {
        OR: [
          { isGlobal: true },
          { userId },
        ],
      },
    });

    res.json(categories);
  } catch (err) {
    next(err);
  }
});

// POST /category
router.post(
  "/category",
  validateBody(createCategorySchema),
  async (req, res, next) => {
    try {
      const { name, scope, userId } = req.body as {
        name: string;
        scope: "global" | "user";
        userId?: number;
      };

      if (scope === "user") {
        if (typeof userId !== "number") {
          return res
            .status(400)
            .json({ error: "userId is required for user scope" });
        }

        const user = await prisma.user.findUnique({
          where: { id: userId },
        });
        if (!user) {
          return res.status(400).json({ error: "User does not exist" });
        }

        const category = await prisma.category.create({
          data: {
            name,
            isGlobal: false,
            userId,
          },
        });

        return res.status(201).json(category);
      }

      const category = await prisma.category.create({
        data: {
          name,
          isGlobal: true,
          userId: null,
        },
      });

      res.status(201).json(category);
    } catch (err) {
      next(err);
    }
  }
);

// DELETE /category/:categoryId
router.delete("/category/:categoryId", async (req, res, next) => {
  try {
    const id = Number(req.params.categoryId);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid category id" });
    }

    await prisma.record.deleteMany({
      where: { categoryId: id },
    });

    const deleted = await prisma.category.delete({
      where: { id },
    });

    if (!deleted) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.status(204).send();
  } catch (err: any) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Category not found" });
    }
    next(err);
  }
});

export default router;

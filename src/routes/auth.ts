import { Router } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../db/prisma";
import { validateBody } from "../middleware/validate";
import {
  registerUserSchema,
  loginSchema,
} from "../schemas/user";
import { generateAccessToken } from "../middleware/auth";

const router = Router();

// POST /user - registration
router.post(
  "/user",
  validateBody(registerUserSchema),
  async (req, res, next) => {
    try {
      const { name, username, password } = req.body;

      const existing = await prisma.user.findUnique({
        where: { username },
      });

      if (existing) {
        return res.status(400).json({
          error: "Username already taken",
        });
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          name,
          username,
          passwordHash,
        },
        select: {
          id: true,
          name: true,
          username: true,
        },
      });

      return res.status(201).json(user);
    } catch (err) {
      next(err);
    }
  }
);

// POST /login - user login, returns JWT token
router.post(
  "/login",
  validateBody(loginSchema),
  async (req, res, next) => {
    try {
      const { username, password } = req.body;

      const user = await prisma.user.findUnique({
        where: { username },
      });

      if (!user) {
        return res.status(401).json({
          message: "Invalid username or password",
        });
      }

      const isPasswordValid = await bcrypt.compare(
        password,
        user.passwordHash
      );

      if (!isPasswordValid) {
        return res.status(401).json({
          message: "Invalid username or password",
        });
      }

      const accessToken = generateAccessToken(user.id);

      return res.json({
        accessToken,
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;

import { z } from "zod";

export const registerUserSchema = z.object({
  name: z.string().min(1, "name is required"),
  username: z.string().min(3, "username is required"),
  password: z.string().min(6, "password must be at least 6 characters"),
});

export const loginSchema = z.object({
  username: z.string().min(1, "username is required"),
  password: z.string().min(1, "password is required"),
});

export type RegisterUserInput = z.infer<typeof registerUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

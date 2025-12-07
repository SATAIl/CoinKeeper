import { z } from "zod";

export const createCategorySchema = z
  .object({
    name: z.string().min(1, "name is required"),
    scope: z.enum(["global", "user"]).default("global"),
    userId: z.number().int().optional(),
  })
  .refine(
    (data) => {
      if (data.scope === "user") {
        return typeof data.userId === "number";
      }
      return true;
    },
    {
      message: "userId is required when scope is 'user'",
      path: ["userId"],
    }
  );

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;

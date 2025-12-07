import { z } from "zod";

export const createRecordSchema = z.object({
  userId: z.number().int(),
  categoryId: z.number().int(),
  amount: z.number(),
});

export type CreateRecordInput = z.infer<typeof createRecordSchema>;

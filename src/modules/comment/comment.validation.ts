import { z } from "zod";

export const commentContent = () =>
  z.object({
    body: z.strictObject({
      content: z.string().trim().min(1).max(2000),
    }),
  });

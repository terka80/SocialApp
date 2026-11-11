import { z } from "zod";

export const postContent = () =>
  z.object({
    body: z.strictObject({
      content: z.string().trim().min(1).max(5000),
    }),
  });

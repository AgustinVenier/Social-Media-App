import { z } from "zod";

export const userSchema = z.object({
  username: z.string(),
  password: z.string().min(6),
});

export type userSchema = z.infer<typeof userSchema>;

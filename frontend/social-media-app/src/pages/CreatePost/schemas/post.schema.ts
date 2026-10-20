import { z } from "zod";

export const postSchema = z.object({
  description: z
    .string()
    .trim()
    .min(1, "La descripción es obligatoria")
    .refine((value) => value.split(/\s+/).filter(Boolean).length <= 130, {
      message: "La descripción no puede superar 130 palabras",
    }),
  photoUrl: z.string().trim().min(1, "La foto es obligatoria"),
});

export type PostSchema = z.infer<typeof postSchema>;

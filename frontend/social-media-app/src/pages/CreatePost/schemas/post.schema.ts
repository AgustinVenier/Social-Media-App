import { z } from "zod";

export const postSchema = z.object({
	description: z
		.string()
		.trim()
		.min(1, "La descripción es obligatoria")
		.refine((value) => value.split(/\s+/).filter(Boolean).length <= 130, {
			message: "La descripción no puede superar 130 palabras",
		}),
	photo: z
		.instanceof(File, { message: "La foto es obligatoria" })
		.refine((file) => file.type.startsWith("image/"), {
			message: "El archivo debe ser una imagen válida",
		}),
});

export type PostSchema = z.infer<typeof postSchema>;

import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod/dist/zod.js";
import { postSchema } from "./schemas/post.schema";
import type { z } from "zod";
import ButtonForm from "@/components/ButtonForm";
import InputForm from "@/components/InputForm";

type Props = {};
type CreatePostFormData = z.infer<typeof postSchema>;

function CreatePost({}: Props) {
  const methods = useForm<CreatePostFormData>({
    resolver: zodResolver(postSchema),
  });

  const { mutate, isPending, error } = useMutation({
    mutationKey: ["posts"],
    mutationFn: async (data: CreatePostFormData) => {
      const response = await axios.post(
        "http://localhost:3000/api/posts/create",
        data,
      );
      return response.data;
    },
    onSuccess: (data) => {
      console.log("✅ Post creado exitosamente:", data);
      // Aquí puedes agregar lógica adicional después de crear el post, como redirigir o actualizar la UI
    },
    onError: (error) => {
      console.error("❌ Error al crear el post:", error);
    },
  });
  const onSubmit = (data: CreatePostFormData) => {
    console.log("📝 onSubmit llamado con:", data);
    mutate(data);
  };

  return (
    <div>
      <h1>Create Post</h1>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <div>
            <InputForm name="description">Description</InputForm>
          </div>
          <div>
            <InputForm name="photoUrl" type="text">
              PhotoUrl
            </InputForm>
          </div>
          {error && <p className="text-red-500">{error.message}</p>}
          <ButtonForm disabled={isPending}>Create Post</ButtonForm>
        </form>
      </FormProvider>
    </div>
  );
}

export default CreatePost;

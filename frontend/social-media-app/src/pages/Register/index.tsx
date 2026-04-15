import { FormProvider, useForm } from "react-hook-form";
import Button from "../../components/Button";
import axios from "axios";
import Input from "../../components/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema, type RegisterUser } from "./schemas/user";
import { useMutation } from "@tanstack/react-query";

function RegisterForm() {
  const { mutate, isPending, error } = useMutation({
    mutationFn: async (data: RegisterUser) => {
      const response = await axios.post<RegisterUser>("/api/register", data);
      return response.data;
    },
    onSuccess: () => {
      alert("Usuario registrado con éxito");
    },
  });
  const methods = useForm<RegisterUser>({
    resolver: zodResolver(userSchema),
  });
  const onSubmit = (data: RegisterUser) => {
    console.log(data);
    mutate(data);
  };

  return (
    <FormProvider {...methods}>
      <form action="/login" onSubmit={methods.handleSubmit(onSubmit)}>
        <Input name="username">Username</Input>
        <Input name="password">Password</Input>
        {error && <p className="text-red-500">{error.message}</p>}
        <Button disabled={isPending}>Enviar</Button>
      </form>
    </FormProvider>
  );
}

export default RegisterForm;

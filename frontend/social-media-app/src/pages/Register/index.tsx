import { FormProvider, useForm } from "react-hook-form";
import Button from "../../components/ButtonForm";
import axios from "axios";
import Input from "../../components/InputForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema, type RegisterUser } from "./schemas/user";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

function RegisterForm() {
  const navigate = useNavigate();
  const { mutate, isPending, error } = useMutation({
    mutationFn: async (data: RegisterUser) => {
      const response = await axios.post(
        "http://localhost:3000/api/auth/register",
        data,
      );
      return response.data;
    },
    onSuccess: () => {
      alert("Usuario registrado con éxito");
      navigate("/login");
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

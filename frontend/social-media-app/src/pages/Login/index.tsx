import { FormProvider, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema } from "./schemas/user.schema";
import { useDispatch } from "react-redux";
import axios from "axios";
import InputForm from "../../components/InputForm";
import ButtonForm from "../../components/ButtonForm";
import { createUser } from "@/redux/states/user.state";
import { Box, Center, Container, Heading } from "@chakra-ui/react";
import { persistenceUserInfo } from "@/services/persist-user-info.service";

type Props = {};

function Login({}: Props) {
  const dispatch = useDispatch();

  const methods = useForm<userSchema>({
    resolver: zodResolver(userSchema),
  });
  const { mutate, isPending, error } = useMutation({
    mutationFn: async (data: userSchema) => {
      console.log("📤 Enviando datos:", data);
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        data,
      );
      return response.data;
    },
    onSuccess: (data) => {
      console.log("✅ Login exitoso, datos recibidos:", data);
      console.log("💾 Guardando en cookies...");
      persistenceUserInfo(data.user);
      console.log("🔴 Guardando en Redux...");
      dispatch(createUser(data.user));
      console.log("🎯 Redirigiendo a /...");
      // Esperar un poco para asegurar que se actualice Redux antes de redirigir
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
    },
    onError: (error) => {
      console.error("❌ Error en login:", error);
    },
  });
  const onSubmit = (data: userSchema) => {
    console.log("📝 onSubmit llamado con:", data);
    mutate(data);
  };
  return (
    <Center>
      <Container
        marginTop={"200px"}
        width={"700px"}
        padding={"20px"}
        boxShadow={"md"}
      >
        <Heading as="h1" size="2xl" textAlign={"center"} marginBottom={"50px"}>
          Login
        </Heading>
        <FormProvider {...methods}>
          <form action="/" onSubmit={methods.handleSubmit(onSubmit)}>
            <Box display={"flex"} justifyContent={"center"} marginTop={"20px"}>
              <InputForm name="username">Username</InputForm>
            </Box>
            <Box display={"flex"} justifyContent={"center"} marginTop={"20px"}>
              <InputForm name="password">Password</InputForm>
            </Box>
            {error && <p className="text-red-500">{error.message}</p>}
            <Box display={"flex"} justifyContent={"center"} marginTop={"20px"}>
              <ButtonForm disabled={isPending}>Enviar</ButtonForm>
            </Box>
          </form>
        </FormProvider>
        <p className="text-center text-gray-500">
          You are not registered?{" "}
          <a href="/register" className="text-blue-500 hover:underline">
            Register here
          </a>
        </p>
      </Container>
    </Center>
  );
}

export default Login;

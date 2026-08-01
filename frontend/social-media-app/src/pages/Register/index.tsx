import { FormProvider, useForm } from "react-hook-form";
import Button from "../../components/ButtonForm";
import axios from "axios";
import Input from "../../components/InputForm";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema, type RegisterUser } from "./schemas/user";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Box, Center, Container, Heading } from "@chakra-ui/react";

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
    <Center>
      <Container
        marginTop={"200px"}
        width={"700px"}
        padding={"20px"}
        boxShadow={"md"}
      >
        <Heading as="h1" size="2xl" textAlign={"center"} marginBottom={"50px"}>
          Register
        </Heading>
        <FormProvider {...methods}>
          <form action="/login" onSubmit={methods.handleSubmit(onSubmit)}>
            <Box display={"flex"} justifyContent={"center"} marginTop={"20px"}>
              <Input name="username">Username</Input>
            </Box>
            <Box display={"flex"} justifyContent={"center"} marginTop={"20px"}>
              <Input name="password">Password</Input>
            </Box>
            {error && <p className="text-red-500">{error.message}</p>}
            <Box display={"flex"} justifyContent={"center"} marginTop={"20px"}>
              <Button disabled={isPending}>Enviar</Button>
            </Box>
          </form>
        </FormProvider>
        <p className="text-center text-gray-500">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Login here
          </a>
        </p>
      </Container>
    </Center>
  );
}

export default RegisterForm;

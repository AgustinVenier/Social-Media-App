import { FormProvider, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema } from "./schemas/user.schema";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Input from "../../components/Input";
import Button from "../../components/Button";
import type { AppStore } from "@/redux/store";
import { createUser } from "@/redux/states/user.state";

type Props = {};

function Login({}: Props) {
  const dispatch = useDispatch();
  const userState = useSelector((store: AppStore) => store.user);
  const methods = useForm<userSchema>({
    resolver: zodResolver(userSchema),
  });
  const { mutate, isPending, error } = useMutation({
    mutationFn: async (data: userSchema) => {
      await axios.post("/api/login", data).then((res) => res.data);
    },
    onSuccess: (data) => {
      //guardar el token en el estado global (redux)
      console.log(data);
      dispatch(createUser(data));
    },
  });
  const onSubmit = (data: userSchema) => {
    mutate(data);
    console.log(data);
  };
  return (
    <>
      <FormProvider {...methods}>
        <form action="/" onSubmit={methods.handleSubmit(onSubmit)}>
          <Input name="username">Username</Input>
          <Input name="password">Password</Input>
          {error && <p className="text-red-500">{error.message}</p>}
          <Button disabled={isPending}>Enviar</Button>
        </form>
      </FormProvider>
    </>
  );
}

export default Login;

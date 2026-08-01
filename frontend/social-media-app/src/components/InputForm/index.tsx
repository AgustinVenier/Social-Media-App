import { type ReactNode } from "react";
import { useFormContext } from "react-hook-form";
import { Input, Field } from "@chakra-ui/react";

type Props = {
  name: string;
  children: ReactNode;
  type?: string;
};

function InputForm({ name, children, type }: Props) {
  const { register, formState, getFieldState } = useFormContext();
  const { error } = getFieldState(name, formState);
  return (
    <div style={{ width: "100%" }}>
      <Field.Root invalid={!!error} width={"100%"}>
        <Input
          {...register(name)}
          size="xl"
          borderRadius="10px"
          type={type}
          id={name}
          width={"100%"}
          placeholder={typeof children === "string" ? children : undefined}
        />

        {error?.message && <Field.ErrorText>{error.message}</Field.ErrorText>}
      </Field.Root>
    </div>
  );
}
export default InputForm;

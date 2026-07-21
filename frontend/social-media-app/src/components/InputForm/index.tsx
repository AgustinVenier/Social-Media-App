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
    <div>
      <Field.Root invalid={!!error}>
        <Field.Label htmlFor={name}>{children}</Field.Label>
        <Input {...register(name)} type={type} id={name} />

        {error?.message && <Field.ErrorText>{error.message}</Field.ErrorText>}
      </Field.Root>
    </div>
  );
}
export default InputForm;

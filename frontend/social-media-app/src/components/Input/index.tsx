import { type ReactNode } from "react";
import { useFormContext } from "react-hook-form";

type Props = {
  name: string;
  children: ReactNode;
  type?: string;
};

function Input({ name, children, type }: Props) {
  const { register, formState, getFieldState } = useFormContext();
  const { error } = getFieldState(name, formState);
  return (
    <div>
      <label htmlFor={name}>{children}</label>
      <input {...register(name)} type={type} id={name} />
      {error?.message && <div>{error.message}</div>}
    </div>
  );
}
export default Input;

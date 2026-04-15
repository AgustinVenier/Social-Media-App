import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  disabled?: boolean;
};

function Button({ children, disabled }: Props) {
  return <button disabled={disabled}>{children}</button>;
}

export default Button;

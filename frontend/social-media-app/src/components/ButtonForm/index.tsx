import type { ReactNode } from "react";
import { Button } from "@chakra-ui/react";

type Props = {
  children: ReactNode;
  disabled?: boolean;
};

function ButtonForm({ children, disabled }: Props) {
  return (
    <Button type="submit" width="100%" borderRadius="100px" disabled={disabled}>
      {children}
    </Button>
  );
}

export default ButtonForm;

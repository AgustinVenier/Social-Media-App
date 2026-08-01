import { FaCamera, FaUser } from "react-icons/fa";
import { IconButton, Container, Heading, Flex } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
// import { getUsername } from "@/services/cookies.service";
import { getPersistedUserInfo } from "@/services/persist-user-info.service";

type Props = {};

function NavBar({}: Props) {
  const cookieUser = getPersistedUserInfo(); // Implementa esta función para obtener el usuario de las cookies
  console.log("Usuario en NavBar:", cookieUser); // Verifica que el usuario se está obteniendo correctamente
  return (
    <>
      <Container
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        padding={"20px"}
        bg={"gray.400"}
        maxW="100%"
      >
        {/* Logo + Nombre */}
        <Flex alignItems={"center"} gap={3} cursor="pointer">
          <IconButton
            aria-label="logo"
            cursor="pointer"
            size="lg"
            padding={"10px"}
          >
            <FaCamera size={24} />
          </IconButton>

          <Heading as="h1" size="lg">
            Social Media App
          </Heading>
        </Flex>

        {cookieUser ? (
          <>
            <p>Hola, {cookieUser.username}!</p>
            <IconButton aria-label="profile" cursor="pointer">
              <FaUser size={20} />
            </IconButton>
          </>
        ) : (
          <></>
        )}
      </Container>
      <Outlet />
    </>
  );
}

export default NavBar;

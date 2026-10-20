import { FaCamera } from "react-icons/fa";
import { IoIosAddCircleOutline, IoMdMore } from "react-icons/io";

import {
  Box,
  IconButton,
  Input,
  InputGroup,
  Container,
  Menu,
  Portal,
  Heading,
  Flex,
  Image,
  Avatar,
  Alert,
} from "@chakra-ui/react";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

// import { getUsername } from "@/services/cookies.service";
import { getPersistedUserInfo } from "@/services/persist-user-info.service";
import { clearUserCookie } from "@/services/cookies.service";
import { clearUser } from "@/redux/states/user.state";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import axios from "axios";

type Props = {};

function NavBar({}: Props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const inputRef = useRef<HTMLInputElement>(null);
  const { mutate: logout } = useMutation({
    mutationFn: async () => {
      await axios.post("http://localhost:3000/api/auth/logout");
    },
    onSuccess: () => {
      dispatch(clearUser());
      clearUserCookie();
      navigate("/login");
    },
  });
  const {
    mutate: followUser,
    isSuccess,
    isError,
    reset,
  } = useMutation({
    mutationFn: async () => {
      await axios.post("http://localhost:3000/api/follow/follow", {
        username: inputRef.current?.value,
      });
    },
    onSuccess: () => {
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    },
  });

  useEffect(() => {
    if (!isSuccess && !isError) return;
    const timeout = setTimeout(() => reset(), 3000);
    return () => clearTimeout(timeout);
  }, [isSuccess, isError, reset]);

  const cookieUser = getPersistedUserInfo(); // Implementa esta función para obtener el usuario de las cookies
  console.log("Usuario en NavBar:", cookieUser); // Verifica que el usuario se está obteniendo correctamente
  return (
    <Box minH="100vh" bg="gray.100">
      {isSuccess && (
        <Alert.Root
          status="success"
          position="fixed"
          top="90px"
          left="50%"
          transform="translateX(-50%)"
          zIndex={20}
          w="fit-content"
        >
          <Alert.Indicator />
          <Alert.Title>User added!</Alert.Title>
        </Alert.Root>
      )}
      {isError && (
        <Alert.Root
          status="error"
          position="fixed"
          top="90px"
          left="50%"
          transform="translateX(-50%)"
          zIndex={20}
          w="fit-content"
        >
          <Alert.Indicator />
          <Alert.Title>User can't be added!</Alert.Title>
        </Alert.Root>
      )}
      <Container
        position="fixed"
        top={0}
        left={0}
        zIndex={10}
        h="80px"
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        padding={"20px"}
        bg={"white"}
        maxW="100%"
        w="100%"
      >
        {/* Logo + Nombre */}
        <Flex alignItems={"center"} gap={3} cursor="pointer">
          <IconButton
            aria-label="logo"
            cursor="pointer"
            size="lg"
            padding={"10px"}
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
              navigate("/");
            }}
          >
            <FaCamera size={24} />
            <Heading as="h1" size="lg">
              Social Media App
            </Heading>
          </IconButton>
        </Flex>

        {cookieUser ? (
          <Flex alignItems={"center"} gap={3}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                reset();
                followUser();
              }}
            >
              <InputGroup
                endElement={
                  <IconButton type="submit" aria-label="Add user" size="xs">
                    <IoIosAddCircleOutline />
                  </IconButton>
                }
              >
                <Input ref={inputRef} placeholder="Add User" />
              </InputGroup>
            </form>
            {cookieUser.urlPhoto === "null" ? (
              <Image
                src={cookieUser.urlPhoto}
                alt="Profile"
                boxSize="40px"
                borderRadius="full"
              />
            ) : (
              <Avatar.Root size="md">
                <Avatar.Image
                  src={cookieUser.urlPhoto}
                  alt="Profile"
                  boxSize="40px"
                  borderRadius="full"
                />
                <Avatar.Fallback name={cookieUser.username} />
              </Avatar.Root>
            )}
            <Menu.Root>
              <Menu.Trigger asChild>
                <IconButton>
                  <IoMdMore />
                </IconButton>
              </Menu.Trigger>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content>
                    <Menu.Item
                      onClick={() => {
                        navigate("/profile");
                      }}
                      cursor="pointer"
                      color="black"
                      value="profile"
                    >
                      Profile
                    </Menu.Item>
                    <Menu.Item
                      color="black"
                      value="logout"
                      cursor="pointer"
                      onClick={() => {
                        logout();
                      }}
                    >
                      LogOut
                    </Menu.Item>
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>
          </Flex>
        ) : (
          <></>
        )}
      </Container>
      <Box pt="80px">
        <Outlet />
      </Box>
    </Box>
  );
}

export default NavBar;

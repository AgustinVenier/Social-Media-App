import { createBrowserRouter } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import Feed from "./Feed";
import NavBar from "@/components/NavBar";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <NavBar />,
    children: [
      {
        index: true,
        element: <Feed />,
      },
    ],
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

import { createBrowserRouter } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import Feed from "./Feed";
import NavBar from "@/components/NavBar";
import CreatePost from "./CreatePost";
import ProtectedRoute from "@/components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        element: <NavBar />,
        children: [
          {
            index: true,
            element: <Feed />,
          },
        ],
      },
      {
        path: "/create",
        element: <CreatePost />,
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

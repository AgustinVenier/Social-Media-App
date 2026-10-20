import { createBrowserRouter } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import Feed from "./Feed";
import NavBar from "@/components/NavBar";
import CreatePost from "./CreatePost";
import ProtectedRoute from "@/components/ProtectedRoute";
import Profile from "./Profile";

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
          {
            path: "/create",
            element: <CreatePost />,
          },
          {
            path: "/profile",
            element: <Profile />,
          },
        ],
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

import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Register from "./Register";
import Login from "./Login";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
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

import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { AppStore } from "@/redux/store";

function ProtectedRoute() {
  const userId = useSelector((state: AppStore) => state.user.id);

  if (!userId) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;

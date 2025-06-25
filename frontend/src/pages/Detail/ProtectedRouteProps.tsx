import { useSelector } from "react-redux";
import { RootState } from "../../stores/store";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  adminOnly?: boolean;
  children: React.ReactNode;
}

const ProtectedRoute = ({
  adminOnly = false,
  children,
}: ProtectedRouteProps) => {
  const { token, isAdmin, isLoading } = useSelector(
    (state: RootState) => state.auth
  );
  console.log("✅ isAdmin:", isAdmin);
  console.log("✅ token:", token);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

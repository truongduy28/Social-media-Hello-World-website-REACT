import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedLayout = ({ children }) => {
  const isLogin = useSelector((state) => state.user);

  if (!isLogin?.value?.accessToken) {
    return <Navigate to="/home" />;
  }
  return children;
};

export default ProtectedLayout;

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { PreLoader } from "./ui/Preloader";
import Layout from "@/layout";
import { Navigate, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { toast } from "sonner";

const ProtectedRoutes = () => {
  const isAuthenticated = true;
  const [loading, setLoading] = useState(true);
  const dispath = useDispatch();
  const navigate = useNavigate();

  const ValidateToken = async () => {
    // try {
    //   const response = await axios.get(BASE_URL + "/API/Login/ValidateToken");
    // } catch (error) {
    //   const axiosError = error as AxiosError;
    //   if (axiosError.response?.status === 401) {
    //     toast.error(
    //       "Your session has expired or is invalid. Please log in again to continue."
    //     );
    //     navigate("/login", { replace: true });
    //     dispath({
    //       type: "store/reset",
    //     });
    //     sessionStorage.clear();
    //   }
    // }
  };

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error(
        "Your session has expired or is invalid. Please log in again to continue."
      );
      navigate("/login", { replace: true });
      dispath({
        type: "store/reset",
      });
      sessionStorage.clear();
    } else {
      ValidateToken();
    }

    setLoading(false);
  }, [isAuthenticated]);

  if (false) {
    return <PreLoader messages={["Loading", "Just there"]} dotCount={3} />; // Show loader while checking authentication
  } else {
    return <Layout />;
  }
};

export default ProtectedRoutes;

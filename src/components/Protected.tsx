import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { PreLoader } from "./ui/Preloader";
import Layout from "@/layout";
import { Navigate, useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { BASE_URL } from "@/lib/constants";
import { setAuth } from "@/features/authSlice/authSlice";

const ProtectedRoutes = () => {
  const isAuthenticated = true;
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const ValidateToken = async () => {
    try {
      if (!localStorage.getItem("token")) {
        navigate("/login");
      }
      const res = await axios.get(BASE_URL + "API/Login/Role");
      if (res.status === 200) {
        localStorage.setItem("token", res.data.access_token);
        dispatch(
          setAuth({
            username: res.data.email,
            role: `${res.data.authority}`,
            roleId: `${res.data.authority_id}`,
          })
        );
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 401) {
        toast.error(
          "Your session has expired or is invalid. Please log in again to continue."
        );
        navigate("/login", { replace: true });
        dispatch({
          type: "store/reset",
        });
        sessionStorage.clear();
      }
    }
  };

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error(
        "Your session has expired or is invalid. Please log in again to continue."
      );
      navigate("/login", { replace: true });
      dispatch({
        type: "store/reset",
      });
      sessionStorage.clear();
    } else {
      ValidateToken();
    }

    setLoading(false);
  }, [isAuthenticated]);

  if (loading) {
    return <PreLoader messages={["Loading", "Just there"]} dotCount={3} />; // Show loader while checking authentication
  } else {
    return <Layout />;
  }
};

export default ProtectedRoutes;

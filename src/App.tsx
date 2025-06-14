import { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { BASE_URL } from "./lib/constants";
import ProtectedRoutes from "./components/Protected";
import Login from "./pages/Login";

axios.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    config.headers.Authorization = localStorage.getItem("token");
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  function (response) {
    // Do something with response data
    return response;
  },
  function (error) {
    if (error?.response?.status === 401) {
      localStorage.removeItem("token");
      sessionStorage.clear();
      window.location.href = "/login";
      toast.error(
        "Your session has expired or is invalid. Please log in again to continue."
      );
    }
    // Do something with response error
    return Promise.reject(error);
  }
);

function App() {
  useEffect(() => {
    axios.defaults.baseURL = BASE_URL;
  }, []);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <ProtectedRoutes />,
      children: [],
    },
    {
      path: "/login",
      element: <Login />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;

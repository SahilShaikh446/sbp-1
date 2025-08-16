import { createBrowserRouter, RouterProvider } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import ProtectedRoutes from "./components/Protected";
import Login from "./pages/Login";
import Master from "./pages/masterAdmin/Master";
import OilReportTabs from "./pages/OilReportTabs";
import OilReportUpdate from "./features/oilReport/OilReportUpdate";
import ABCReport from "./pages/ABCReport";
import ContactUs from "./pages/ContactUs";
import MasterDashboard from "./pages/masterAdmin/MasterDashboard";
import { Dashboard } from "./pages/dashboard";

axios.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    config.headers.accesstoken = localStorage.getItem("token");
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
  const router = createBrowserRouter([
    {
      path: "/",
      element: <ProtectedRoutes />,
      children: [
        {
          path: "/",
          element: <Dashboard />,
          // element: "",
        },
        {
          path: "/masters",
          element: <Master />,
        },
        {
          path: "/oil-report",
          element: <OilReportTabs />,
        },
        {
          path: "/oil-report/:id",
          element: <OilReportUpdate />,
        },
        {
          path: "/abc-report",
          element: <ABCReport />,
        },
        {
          path: "/contact-us",
          element: <ContactUs />,
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;

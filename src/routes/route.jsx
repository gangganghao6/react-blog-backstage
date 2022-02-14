import { useRoutes, Navigate, useLocation } from "react-router-dom";
import Test from "../views/Test";

let AllRoutes = () => {
  return useRoutes([
    {
      path: "/",
      element: <Test />,
    },
    {
      path: "*",
      element: <Navigate to="/" />,
    },
  ]);
};
export default AllRoutes;

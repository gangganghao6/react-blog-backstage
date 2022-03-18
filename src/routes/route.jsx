import { useRoutes, Navigate, useLocation } from "react-router-dom";
import BlogListPage from "../views/BlogListPage";
import EditBlogPage from "../views/EditBlogPage";
import BlogPublishPage from "../views/BlogPublishPage";
import AlbumListPage from "../views/AlbumListPage";

const AllRoutes = () => {
  return useRoutes([
    {
      path: "/index",
      element: <></>,
    },
    {
      path: "/bloglist",
      element: <BlogListPage />,
    },
    {
      path: "/bloglist/publish",
      element: <BlogPublishPage />,
    },
    {
      path: "/bloglist/edit/:id",
      element: <EditBlogPage />,
    },
    {
      path:"/album",
      element: <AlbumListPage/>
    },
    {
      path: "*",
      element: <Navigate to="/index" />,
    },
  ]);
};
export default AllRoutes;

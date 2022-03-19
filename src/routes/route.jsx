import {useRoutes, Navigate, useLocation} from "react-router-dom";
import BlogListPage from "../views/BlogListPage";
import EditBlogPage from "../views/EditBlogPage";
import BlogPublishPage from "../views/BlogPublishPage";
import AlbumListPage from "../views/AlbumListPage";
import EditAlbumPage from "../views/EditAlbumPage";
import AlbumPublishPage from "../views/AlbumPublishPage";
import TimeLinePage from "../views/TimeLinePage";
import TagsPage from "../views/TagsPage";

const AllRoutes = () => {
  return useRoutes([
    {
      path: "/index",
      element: <></>,
    },
    {
      path: "/bloglist",
      element: <BlogListPage/>,
    },
    {
      path: "/bloglist/publish",
      element: <BlogPublishPage/>,
    },
    {
      path: "/bloglist/edit/:id",
      element: <EditBlogPage/>,
    },
    {
      path: "/album",
      element: <AlbumListPage/>
    },
    {
      path: "/album/publish",
      element: <AlbumPublishPage/>,
    },
    {
      path: "/album/edit/:id",
      element: <EditAlbumPage/>,
    },
    {
      path: "/timeline",
      element: <TimeLinePage/>,
    },
    {
      path: "/about",
      element: <EditBlogPage my={1}/>,
    },
    {
      path: "/tags",
      element: <TagsPage/>,
    },
    {
      path: "*",
      element: <Navigate to="/index"/>,
    },
  ]);
};
export default AllRoutes;

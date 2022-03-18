import AllRoutes from "./routes/route";
import "./assets/style/App.scss";
import { Layout, Menu } from "antd";
import {
  AppstoreOutlined,
  BarChartOutlined,
  CloudOutlined,
  ShopOutlined,
  TeamOutlined,
  UserOutlined,
  UploadOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getSelectedKeys, siderItem } from "./utils/getSelectedKeys";

const { Header, Content, Footer, Sider } = Layout;

function changeSelected(setSelected) {
  return function ({ key }) {
    setSelected([key]);
  };
}

function App() {
  const [selected, setSelected] = useState([]);
  const { pathname } = useLocation();
  useEffect(() => {
    setSelected([`${getSelectedKeys(pathname)}`]);
  }, [pathname]);

  return (
    <div className="App">
      <Layout hasSider>
        <Sider className={"sider"}>
          <div className="logo">Blog后台管理</div>
          <Menu theme="dark" mode="inline" selectedKeys={selected} onClick={changeSelected(setSelected)}>
            {siderItem.map((item) => {
              return (
                <Menu.Item key={item.key} icon={<UserOutlined />}>
                  <NavLink to={item.path}>{item.text}</NavLink>
                </Menu.Item>
              );
            })}
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 0 }} />
          <Content className={"content-container"}>
            <div className="site-layout-background" style={{ padding: 24, textAlign: "center" }}>
              <AllRoutes />
            </div>
          </Content>
          <Footer style={{ textAlign: "center" }}>Ant Design ©2018 Created by Ant UED</Footer>
        </Layout>
      </Layout>
    </div>
  );
}

export default App;

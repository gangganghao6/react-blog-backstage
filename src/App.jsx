import AllRoutes from './routes/route';
import './assets/style/App.scss';
import {Layout, Menu, Spin} from 'antd';
import {LoadingOutlined, UserOutlined} from '@ant-design/icons';
import {NavLink, useLocation} from 'react-router-dom';
import {useEffect, useState} from 'react';
import {getSelectedKeys, siderItem} from './utils/getSelectedKeys';
import store from './reducer/resso';

const {Header, Content, Footer, Sider} = Layout;

function changeSelected(setSelected) {
 return function ({key}) {
  setSelected([key]);
 };
}

function App() {
 const {loading, setLoading} = store;
 const [selected, setSelected] = useState([]);
 const {pathname} = useLocation();
 const antIcon = <LoadingOutlined style={{fontSize: 24}} spin/>;
 useEffect(() => {
  setSelected([`${getSelectedKeys(pathname)}`]);
 }, [pathname]);
 return (
     <div className="App">
      <div
          className={'loading'}
          style={{
           position: 'fixed',
           width: '100vw',
           height: '100vh',
           display: loading ? 'flex' : 'none',
           justifyContent: 'center',
           alignItems: 'center',
           // background: loading ? "rgba(0,0,0,0.5)" : 'none',
           zIndex: 100,
          }}
      >
       <Spin indicator={antIcon} tip={'加载中...'} spinning={loading}/>
      </div>
      <Layout hasSider>
       <Sider className={'sider'}>
        <div className="logo">Blog后台管理</div>
        <Menu theme="dark" mode="inline" selectedKeys={selected} onClick={changeSelected(setSelected)}>
         {siderItem.map((item) => {
          return (
              <Menu.Item key={item.key} icon={<UserOutlined/>}>
               <NavLink to={item.path}>{item.text}</NavLink>
              </Menu.Item>
          );
         })}
        </Menu>
       </Sider>
       <Layout className="site-layout">
        <Header className="site-layout-background" style={{padding: 0}}/>
        <Content className={'content-container'}>
         <div className="site-layout-background" style={{padding: 24, textAlign: 'center'}}>
          <AllRoutes/>
         </div>
        </Content>
        <Footer
            style={{textAlign: 'center', position: 'relative', bottom: '0', width: 'calc(100vw - 200px)', right: '0'}}>Ant
         Design ©2018 Created
         by Ant
         UED</Footer>
       </Layout>
      </Layout>
     </div>
 );
}

export default App;

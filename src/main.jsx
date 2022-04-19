import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/style/base.scss';
import App from './App';
import {HashRouter} from 'react-router-dom';
// import 'antd/dist/antd.css';
import 'antd/dist/antd.variable.min.css';
import zhCN from 'antd/lib/locale/zh_CN';
import {ConfigProvider} from 'antd';

ConfigProvider.config({
 theme: {
  // primaryColor: '#25b864',
 },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ConfigProvider locale={zhCN}>
     <HashRouter>
      <App/>
     </HashRouter>
    </ConfigProvider>
);

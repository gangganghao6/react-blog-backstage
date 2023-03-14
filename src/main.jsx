import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/style/base.scss';
import App from './App';
import {HashRouter} from 'react-router-dom';
// import 'antd/dist/antd.css';
import 'antd/dist/antd.variable.min.css';
import zhCN from 'antd/lib/locale/zh_CN';
import {ConfigProvider} from 'antd';
import {MetaMaskProvider} from "metamask-react";

// import {Web3ReactProvider} from "@web3-react/core";
// import {Web3Provider} from "@ethersproject/providers";

// function getLibrary(provider) {
//     const library = new Web3Provider(provider)
//     library.pollingInterval = 5000
//     return library
// }

ConfigProvider.config({
    theme: {
        // primaryColor: '#25b864',
    },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ConfigProvider locale={zhCN}>
        <HashRouter>
            <MetaMaskProvider>
                <App/>
            </MetaMaskProvider>
        </HashRouter>
    </ConfigProvider>
);

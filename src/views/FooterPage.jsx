import {memo, useEffect, useState} from 'react';
import Footer from 'rc-footer';
import {useRequest} from 'ahooks';
import axios from 'axios';
import '../assets/style/footer.scss';
import 'rc-footer/assets/index.css';
import {useImmer} from 'use-immer';
import {Button, message, notification} from 'antd';
import {service} from '../requests/request';
import {SmileOutlined} from '@ant-design/icons';

function getFooter() {
 return service.get('/api/info/footers');
}

const args = {
 message: '提示',
 description:
     '页脚内容请直接修改后端目录下/src/footers/footers.info.ts文件',
 duration: 0,
 icon: <SmileOutlined style={{ color: '#108ee9' }} />,
};

export default memo(function FooterPage() {
 let {data} = useRequest(getFooter);
 useEffect(() => {
  notification.open(args);
  return function () {
   notification.destroy();
  };
 }, []);
 return <>
  <Footer theme={'light'} columns={data ? data.data.data : []} bottom={`Made by Pikachu - Powered by React`}/>
 </>;
});

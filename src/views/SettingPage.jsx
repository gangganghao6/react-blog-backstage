import {memo, useEffect, useState} from 'react';
import {Button, Divider, Input, message, Select, Space, Upload} from 'antd';
import {ControlOutlined, SolutionOutlined, UserOutlined} from '@ant-design/icons';
import {service} from '../requests/request';
import {useRequest} from 'ahooks';
import Search from 'antd/es/input/Search';

const {Option} = Select;

function upLoadHeader(setVisible, setImageUrl, setFileList, header) {
 return async function (e) {
  setFileList(e.fileList);
  if (e.fileList.length >= 1) {
   setVisible(false);
   let formData = new FormData();
   formData.append('files', e.file, e.file.name);
   const result = await service.post('/api/info/userHeader', formData);
   setImageUrl(result.data.data.userHeader);
  } else {
   setVisible(true);
   setImageUrl(header);
  }
 };
}


function getUserInfo() {
 return service.get('/api/info/userInfo');
}

function changeName(setName) {
 return function (e) {
  setName(e.target.value);
 };
}

function changeDescription(setDescription) {
 return function (e) {
  setDescription(e.target.value);
 };
}

function save(imageUrl, name, description, setRefresh, refresh, setFileList, setVisible) {
 return function () {

  service.put('/api/info/userInfo', {
   userInfo: {
    userHeader: imageUrl,
    userName: name,
    userDescription: description
   }
  });
  service.put('/api/info').then();
  setRefresh(!refresh);
  setFileList([]);
  setVisible(true);
  message.success('修改成功');
 };
}

function onChange(setSearchTitle, setSearchId) {
 return async function (e) {
  const result = await service.get(`/api/blogs/${e.target.value}`);
  if (e.target.value) {
   await service.put(`/api/blogs/view/${e.target.value}`, {
    value: -1
   });
  }
  if (result.data.data) {
   setSearchId(result.data.data.id);
   setSearchTitle(result.data.data.title);
  } else {
   setSearchId(-1);
   setSearchTitle(`未找到ID为${e.target.value}的文章`);
  }
 };
}

function changeTopCard(id, color, setRefresh) {
 return async function () {
  if (id && id !== -1) {
   await service.put('/api/info/topCard', {
    id,
    color
   });
   setRefresh((pre) => !pre);
   await service.put('/api/info');
   message.success('修改成功');
  } else {
   message.error('输入正确的ID！');
  }
 };
}

function changeTopCardColor(setTopCardColor) {
 return function (e) {
  setTopCardColor(e);
 };
}

export default memo(function SettingPage() {
 const [refresh, setRefresh] = useState(false);
 const [imageUrl, setImageUrl] = useState(undefined);
 const [visible, setVisible] = useState(true);
 const [name, setName] = useState('');
 const [description, setDescription] = useState('');
 const [searchTitle, setSearchTitle] = useState('');
 const [seatchId, setSearchId] = useState(undefined);
 const [topCardColor, setTopCardColor] = useState('black');
 const [fileList, setFileList] = useState([]);
 const [header, setHeader] = useState('');
 let {data, loading} = useRequest(getUserInfo, {
  refreshDeps: [refresh]
 });
 useEffect(() => {
  if (data && !loading) {
   setName(data.data.data.userName);
   setDescription(data.data.data.userDescription);
   setHeader(data.data.data.userHeader);
  }
 }, [data]);
 return <>
  <Space direction={'vertical'}>
   <h2><ControlOutlined/>设置左侧菜单用户信息</h2>
   <Space>
    <Upload
        listType={'picture-card'}
        beforeUpload={() => false}
        onChange={upLoadHeader(setVisible, setImageUrl, setFileList, header)}
        fileList={fileList}
    >
     {visible ? <div style={{cursor: 'pointer'}}>
      <img src={header}
           style={{width: '100%'}}/>
     </div> : ''}
    </Upload>
    <Space direction={'vertical'}>
     <div>
      名称：
      <Input placeholder="名字(限制10个字)" onChange={changeName(setName)} value={name}
             maxLength={10} style={{width: '300px'}} prefix={<UserOutlined/>}/>
     </div>
     <div>
      描述：
      <Input size="large" placeholder="描述(限制12个字)" onChange={changeDescription(setDescription)}
             value={description} maxLength={12} style={{width: '300px'}} prefix={<SolutionOutlined/>}/>
     </div>
     <Button type={'primary'} ghost
             onClick={save(imageUrl, name, description, setRefresh, refresh, setFileList, setVisible)}>保存</Button>
    </Space>
   </Space>
   <Divider dashed style={{backgroundColor: 'black'}}/>
   <h2><ControlOutlined/>设置置顶文章ID：{data ? data.data.data.topCardId : ''} 颜色：{data ? data.data.data.topCardColor : ''}
   </h2>
   <Space>
    <Select value={topCardColor} style={{width: 120}} onChange={changeTopCardColor(setTopCardColor)}>
     <Option value="white">白色</Option>
     <Option value="black">黑色</Option>
    </Select>
    <Search placeholder="输入文章ID" onChange={onChange(setSearchTitle, setSearchId)}
            onSearch={changeTopCard(seatchId, topCardColor, setRefresh)}
            enterButton={'修改'}/>
    {seatchId ? `ID：${seatchId} 标题：${searchTitle}` : ''}
   </Space>
  </Space>
 </>;
});

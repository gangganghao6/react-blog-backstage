import {memo, useState} from 'react';
import {message, Popconfirm, Timeline} from 'antd';
import dayjs from 'dayjs';
import axios from 'axios';
import {DeleteOutlined} from '@ant-design/icons';
import Search from 'antd/es/input/Search';
import {useRequest} from 'ahooks';
import {service} from '../requests/request';

function getTags() {
 return service.get('/api/info/tags');
}

function onAdd(refresh, setRefresh) {
 return async function (content) {
  await service.post('/api/info/tags', {
   tag: {
    text: content,
    time: +new Date()
   }
  });
  await service.put('/api/info');
  message.success('已发布');
  setRefresh(!refresh);
 };
}

function onDelete(refresh, setRefresh, id) {
 return async function () {
  await service.delete(`/api/info/tags/${id}`);
  await service.put('/api/info');
  message.success('已删除');
  setRefresh(!refresh);
 };
}

export default memo(function TagsPage() {
 const [refresh, setRefresh] = useState(false);
 let {data} = useRequest(getTags, {
  refreshDeps: [refresh],
 });
 return (
     <>
      <Timeline mode="left" style={{textAlign: 'left', marginLeft: '50%'}}>
       {data ? data.data.data.map((item) => {
        return (
            <Timeline.Item
                dot={
                 <>
                  <Popconfirm
                      title="确认是否删除这个标签?"
                      onConfirm={onDelete(refresh, setRefresh, item.id)}
                      okText="是"
                      cancelText="否"
                  >
                   <DeleteOutlined style={{fontSize: '16px'}}/>
                  </Popconfirm>
                 </>
                }
            >
             {item.text}
            </Timeline.Item>
        );
       }) : ''}
      </Timeline>
      <Search
          placeholder="输入新增的标签"
          enterButton="添加"
          size="large"
          onSearch={onAdd(refresh, setRefresh)}
          style={{width: '50%'}}
      />
     </>
 );
});

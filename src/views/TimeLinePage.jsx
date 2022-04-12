import {memo, useState} from 'react';
import {Button, DatePicker, message, Pagination, Popconfirm, Space, Timeline} from 'antd';
import {ClockCircleOutlined, DeleteOutlined} from '@ant-design/icons';
import dayjs from 'dayjs';
import {useRequest} from 'ahooks';
import axios from 'axios';
import Search from 'antd/es/input/Search';
import {service} from '../requests/request';

function getTimeLine() {
 return service.get('/api/info/timelines');
}

function onSearch(refresh, setRefresh, time) {
 return async function (content) {
  time = isNaN(time) ? +new Date() : time;
  await axios.post('/api/info/timelines', {
   timeline: {
    time: time,
    text: content,
   }
  });
  await service.put('/api/info');
  message.success('已发布');
  setRefresh(!refresh);
 };
}

export default memo(function TimeLinePage() {
 const [refresh, setRefresh] = useState(false);
 const [time, setTime] = useState(+new Date());
 const [page, setPage] = useState(1);
 let {data} = useRequest(getTimeLine, {
  refreshDeps: [refresh],
 });
 return (
     <>
      <Timeline mode="alternate" className={'timeline'}>
       {data ? data.data.data.slice((page - 1) * 20, page * 20).map((item) => {
        return (
            <Timeline.Item
                key={item.id}
                label={dayjs(parseInt(item.time)).format('YYYY-MM-DD')}
                dot={
                 <>
                  <Popconfirm
                      title="确认是否删除这个事件?"
                      onConfirm={() => {
                       service.delete(`/api/info/timelines/${item.id}`);
                       service.put('/info');
                       message.success('已删除');
                       setRefresh(!refresh);
                      }}
                      okText="Yes"
                      cancelText="No"
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
       <Pagination pageSize={20}
                   total={data ? data.data.data.length : 0}
                   onChange={setPage} current={page}/>
      </Timeline>
      <br/>
      自定义日期：
      <DatePicker
          size="large"
          onChange={(e, time) => {
           setTime(dayjs(time).valueOf());
          }}
          renderExtraFooter={() => 'extra footer'}
      />
      <Search
          placeholder="输入新增的事件"
          enterButton="添加"
          size="large"
          onSearch={onSearch(refresh, setRefresh, time)}
          style={{width: '30%', marginLeft: '30px'}}
      />
     </>
 );
});

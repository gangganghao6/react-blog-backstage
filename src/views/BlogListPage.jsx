import {memo, useEffect, useState} from 'react';
import {Button, DatePicker, message, Popconfirm, Select, Space, Table} from 'antd';
import dayjs from 'dayjs';
import {NavLink, useNavigate} from 'react-router-dom';
import Search from 'antd/es/input/Search';
import {useRequest} from 'ahooks';
import store from '../reducer/resso';
import {useImmer} from 'use-immer';
import {service} from '../requests/request';

let navigator;
let refresh, setRefresh;
const {Option} = Select;
const columns = [
 {
  title: 'ID',
  dataIndex: 'id',
  sorter: (a, b) => a.id - b.id,
  sortDirections: ['descend', 'ascend'],
 },
 {
  title: '标题',
  dataIndex: 'title',
 },
 {
  title: '标签',
  dataIndex: 'tag',
 },
 {
  title: '发布时间',
  dataIndex: 'time',
  sorter: (a, b) => {
   let result = dayjs(a.time).isAfter(dayjs(b.time));
   if (result === false) {
    return -1;
   } else if (result === true) {
    return 1;
   } else {
    return 0;
   }
  },
  sortDirections: ['descend', 'ascend'],
 },
 {
  title: '浏览量',
  dataIndex: 'view',
  sorter: (a, b) => a.view - b.view,
  sortDirections: ['descend', 'ascend'],
 },
 {
  title: '评论量',
  dataIndex: 'comment',
  sorter: (a, b) => a.comment - b.comment,
  sortDirections: ['descend', 'ascend'],
 },
 {
  title: '编辑',
  dataIndex: 'action',
  render: (e, item) => {
   return (
       <>
        <Space>
         <NavLink to={'/bloglist/edit/' + item.id}>编辑</NavLink>
         <Popconfirm
             title="删除后不可恢复,确定删除吗?"
             onConfirm={async () => {
              if (item.id === 1) {
               message.error('ID为1的博客无法删除');
               return;
              }
              await service.delete(`/api/blogs/${item.id}`);
              await service.put('/api/info');
              message.success('删除成功');
              setRefresh();
             }}
             // onCancel={cancel}
             okText="确定"
             cancelText="取消"
         >
          <a href="#">删除</a>
         </Popconfirm>
        </Space>
       </>
   );
  },
 },
];

function onChangeTable(pagination, filters, sorter, extra) {
}

function onChangeTime(setTime, setType) {
 return function (moment, timeStr) {
  let top = dayjs(timeStr).valueOf();
  let bottom = top + 2626560000;
  setTime((draft) => {
   draft.pre = top;
   draft.aft = bottom;
  });
 };
}

function onSearch(setId, setTitle, type) {
 return function (msg) {
  if (type === 'id') {
   setId(msg);
  } else {
   setTitle(msg);
  }
 };
}

function publish() {
 return function () {
  navigator('/bloglist/publish');
 };
}

function getDataList(id, title, time, type, setLoading) {
 return function () {
  // setLoading(true);
  let config = {};
  // if (type === "id" && id !== "") {
  //   config.id = id;
  // } else if (type === "title" && title !== "") {
  //   config["title_like"] = title;
  // } else if (type === "time") {
  //   config["time_gte"] = time.pre;
  //   config["time_lte"] = time.aft;
  // }
  return service.get('/api/blogs', {params: config});
 };
}

export default memo(function BlogList() {
 ({refresh, setRefresh} = store);
 const [id, setId] = useState(undefined);
 const [title, setTitle] = useState(undefined);
 const [time, setTime] = useImmer({});
 const [type, setType] = useState('id');
 const [loading, setLoading] = useState(true);
 let total = 0;
 navigator = useNavigate();
 const selectBefore = (
     <Select defaultValue="id" className="select-before" onChange={setType} type={type}>
      <Option value="id">ID</Option>
      <Option value="title">标题</Option>
      <Option value="time">时间</Option>
     </Select>
 );
 let {data} = useRequest(getDataList(id, title, time, type, setLoading), {
  refreshDeps: [refresh, id, title, time, type],
 });
 if (data) {
  total = data.data.data.count;
  data = data.data.data.list;
  data.forEach((item) => {
   item.time = dayjs(parseInt(item.time)).format('YYYY-MM-DD HH:mm:ss');
   let totalCount = item.comments.length;
   item.comments.forEach((item) => {
    totalCount += item.innerComments.length;
   });
   item.comment = totalCount;
  });
 }
 useEffect(() => {
  setLoading(false);
 }, [data]);
 return (
     <>
      <Button onClick={publish(navigator)} type={'primary'} style={{marginRight: '50px'}}>
       发布文章
      </Button>
      按条件搜索：
      <Search
          addonBefore={selectBefore}
          defaultValue=""
          style={{width: '25%', marginRight: '50px'}}
          onSearch={onSearch(setId, setTitle, type)}
      />
      <DatePicker onChange={onChangeTime(setTime, setType)} picker="month"/>
      <Table columns={columns} dataSource={data} onChange={onChangeTable} pagination={{total}} loading={loading}/>
     </>
 );
});

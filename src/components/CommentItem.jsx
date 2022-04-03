import {createElement, memo, useState} from 'react';
import {Avatar, Comment, message, Popconfirm, Tooltip} from 'antd';
import {DislikeFilled, DislikeOutlined, LikeFilled, LikeOutlined, UserOutlined} from '@ant-design/icons';
import dayjs from 'dayjs';
import {service} from '../requests/request';

function confirm(data, setRefresh,type) {
 return async function () {
  if (data.isInner) {
   await service.delete(`/api/${type}/innercomments`, {
    data: {ids: [data.id]}
   });
  } else {
   await service.delete(`/api/${type}/comments`, {
    data: {ids: [data.id]}
   });
  }
  await service.put('/info')
  setRefresh();
  message.success('已删除');
 };
}

export default memo(function BlogCommentItem({children, data, setRefresh, type}) {
 const actions = [
  <Popconfirm
      title="确认删除这条评论吗？"
      onConfirm={confirm(data, setRefresh,type)}
      okText="确认"
      cancelText="取消"
  >
    <span key="comment-basic-reply-to">
      删除
    </span>
  </Popconfirm>
 ];
 return (
     <Comment
         className={'blog-comments-item'}
         actions={actions}
         author={<a>{data.name}</a>}
         avatar={
          <Tooltip title={data.email}>
           <Avatar icon={<UserOutlined/>} alt={data.name}/>
          </Tooltip>
         }
         content={<p>{data.comment}</p>}
         datetime={<span>{dayjs(data.time).format('YYYY-MM-DD HH:mm:ss')}</span>}
     >
      {children}
     </Comment>
 );
});

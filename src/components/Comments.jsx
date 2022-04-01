import React, {createElement, useState, memo} from 'react';
import CommentItem from './CommentItem';
import '../assets/style/blogComment.scss';

export default memo(
    function BlogComments({comments, setRefresh, type}) {
     let total = comments.length;
     comments.forEach((item) => {
      total += item.innerComments.length;
     });
     return (
         <div className={'blog-comments-container'}>
          <h1>{total}条评论</h1>
          {comments.map((item) => {
           item.isInner = false;
           return (
               <CommentItem data={item} key={item.id} setRefresh={setRefresh} type={type}>
                {item.innerComments.map((itemx) => {
                 itemx.isInner = true;
                 return <CommentItem data={itemx} key={itemx.id} setRefresh={setRefresh} type={type}/>;
                })}
               </CommentItem>
           );
          })}
         </div>
     );
    },
    (pre, cur) => {
     return false;
    }
);

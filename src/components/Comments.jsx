import React, {createElement, useState, memo} from "react";
import CommentItem from "./CommentItem";
import "../assets/style/blogComment.scss";

export default memo(function BlogComments({comments, setRefresh, setDeletedCount, deletedCount}) {
  function deleteComment(onlyId, isInner) {
    return function () {
      if (!isInner) {
        let total = 0;
        comments.forEach((item, index) => {
          if (item.onlyId === onlyId) {
            total += item.children.length;
            comments.splice(index, 1)
            setDeletedCount(deletedCount + total)
          }
        })
      } else {
        comments.forEach((item) => {
          item.children.forEach((itemx, index) => {
            if (itemx.onlyId === onlyId) {
              item.children.splice(index, 1)
            }
          })
        })
        setDeletedCount(deletedCount + 1)
      }
      setRefresh()
    }
  }

  let total = comments.length;
  comments.forEach((item) => {
    total += item.children.length;
  });
  let count = 0;
  return (
      <div className={"blog-comments-container"}>
        <h1>{total}条评论</h1>
        {comments.map((item) => {
          item.isInner = false;
          item.onlyId = count++;
          return (
              <CommentItem data={item} key={item.time} deleteComment={deleteComment}>
                {item.children.map((itemx) => {
                  itemx.isInner = true;
                  itemx.onlyId = count++;
                  return <CommentItem data={itemx} key={itemx.time} deleteComment={deleteComment}/>;
                })}
              </CommentItem>
          );
        })}
      </div>
  );
}, (pre, cur) => {
  return false;
});

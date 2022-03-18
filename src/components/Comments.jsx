import React, {createElement, useState, memo} from "react";
import NProgress from "nprogress";
import {Tooltip} from "antd";
import {Comment, Avatar, Form, Button, List, Input} from "antd";
import {DislikeOutlined, LikeOutlined, DislikeFilled, LikeFilled, UserOutlined} from "@ant-design/icons";
import dayjs from "dayjs";
import CommentItem from "./CommentItem";
import {useImmer} from "use-immer";
import "../assets/style/blogComment.scss";

export default memo(function BlogComments({comments, setRefresh, refresh, setDeletedCount, deletedCount}) {
  function deleteComment(onlyId, isInner) {
    return function () {
      if (!isInner) {
        comments.forEach((item, index) => {
          if (item.onlyId === onlyId) {
            comments.splice(index, 1)
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
      }
      setDeletedCount(deletedCount + 1)
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

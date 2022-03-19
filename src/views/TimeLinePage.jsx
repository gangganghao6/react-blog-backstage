import {memo, useState} from "react";
import {Button, message, Popconfirm, Timeline} from "antd";
import {ClockCircleOutlined, DeleteOutlined} from "@ant-design/icons";
import dayjs from "dayjs";
import {useRequest} from "ahooks";
import axios from "axios";
import Search from "antd/es/input/Search";
import store from "../reducer/resso";

function getTimeLine() {
  return axios.get('/api/timeline')
}

function onSearch(refresh,setRefresh) {
  return async function (content) {
    await axios.post('/api/timeLine', {
      time: +new Date(),
      record: content
    })
    await axios.patch('/api/updateInfoLastModified')
    message.success('已发布')
    setRefresh(!refresh)
  }
}

export default memo(function TimeLinePage() {
  // const {refresh, setRefresh} = store;
  const[refresh,setRefresh]=useState(false)
  let {data = {data: []}} = useRequest(getTimeLine, {
    refreshDeps: [refresh]
  });
  return <>
    <Timeline mode="alternate" className={"timeline"}>
      {data.data.map((item) => {
        return (
            <Timeline.Item
                key={item.id}
                label={dayjs(item.time).format("YYYY-MM-DD HH:mm:ss")}
                dot={<>
                  <Popconfirm
                      title="确认是否删除这个事件?"
                      onConfirm={() => {
                        axios.delete(`/api/timeLine/${item.id}`)
                        message.success('已删除')
                        setRefresh(!refresh)
                      }}
                      okText="Yes"
                      cancelText="No"
                  >
                    <DeleteOutlined style={{fontSize: "16px"}}/>
                  </Popconfirm>
                </>
                }
            >
              {item.record}
            </Timeline.Item>
        );
      })}
    </Timeline>
    <Search
        placeholder="输入新增的事件"
        // enterButton="新增事件"
        size="large"
        onSearch={onSearch(refresh,setRefresh)}
        style={{width: "50%"}}
    />
  </>
});

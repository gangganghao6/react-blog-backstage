import {memo, useState} from "react";
import {message, Popconfirm, Timeline} from "antd";
import dayjs from "dayjs";
import axios from "axios";
import {DeleteOutlined} from "@ant-design/icons";
import Search from "antd/es/input/Search";
import {useRequest} from "ahooks";

function getTimeLine() {
  return axios.get('/api/tags')
}

function onAdd(refresh, setRefresh) {
  return async function (content) {
    let tags = await axios.get('/api/tags')
    console.log(content)
    let index = tags.data.indexOf(content)
    await axios.patch('/api/updateTags', {
      tag:content
    })
    await axios.patch('/api/updateInfoLastModified')
    message.success('已发布')
    setRefresh(!refresh)
  }
}

function onDelete(refresh, setRefresh, content) {
  return async function () {
    await axios.patch('/api/deleteTags', {tag: content})
    await axios.patch('/api/updateInfoLastModified')
    message.success('已删除')
    setRefresh(!refresh)
  }
}

export default memo(function TagsPage() {
  const [refresh, setRefresh] = useState(false)
  let {data = {data: []}} = useRequest(getTimeLine, {
    refreshDeps: [refresh]
  });
  return <>
    <Timeline mode="alternate" className={"timeline"}>
      {data.data.map((item) => {
        return (
            <Timeline.Item
                // key={item.id}
                // label={dayjs(item.time).format("YYYY-MM-DD HH:mm:ss")}
                dot={<>
                  <Popconfirm
                      title="确认是否删除这个事件?"
                      onConfirm={onDelete(refresh, setRefresh, item)
                      }
                      okText="是"
                      cancelText="否"
                  >
                    <DeleteOutlined style={{fontSize: "16px"}}/>
                  </Popconfirm>
                </>
                }
            >
              {item}
            </Timeline.Item>
        );
      })}
    </Timeline>
    <Search
        placeholder="输入新增的标签"
        // enterButton="新增事件"
        size="large"
        onSearch={onAdd(refresh, setRefresh)}
        style={{width: "50%"}}
    />
  </>;
});

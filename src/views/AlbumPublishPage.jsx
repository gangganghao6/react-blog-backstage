import {memo, useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useRequest} from "ahooks";
import axios from "axios";
import {Button, Divider, Image, Input, List, message, Radio, Space, Table, Upload} from "antd";
import {UploadOutlined} from "@ant-design/icons";
import Compressor from "compressorjs";
import Comments from "../components/Comments";
import store from "../reducer/resso";
import dayjs from "dayjs";
import {useImmer} from "use-immer";
import {service} from "../requests/request";

let formData = new FormData();
let imgPathNames, navigator;
let firstInput = true;
let uploaded = false;
let fileCount=0;
const columns = [
  {
    title: '预览',
    dataIndex: 'src',
    render: (e) => {
      return (<Image width={200} src={`${e}`}/>)
    },
  },
  {
    title: '名称',
    dataIndex: 'src',
  }
]

function onChange( loading, setLoading) {
  return function (info) {
    uploaded = true;
    formData.append(info.file.name, info.file, info.file.name);
    if (firstInput) {
      setLoading(true)
      firstInput = false;
    }
    new Compressor(info.file, {
      quality: 0.1,
      convertTypes: ['image/png', 'image/webp'],
      convertSize: 1000000,
      success(result) {
        formData.append(`gzip_${info.file.name}`, result, `gzip_${info.file.name}`);
        fileCount++;
        if (fileCount === info.fileList.length) {
          setLoading(false)
          firstInput = true;
          message.success('处理完成')
        }
      },
      error(err) {
        console.log(err.message);
      },
    });
  }
}

function upLoad(setMyData, setMyGzipData) {
  return async function () {
    imgPathNames = await service.post('/api/albumImages', formData, {
      headers: {
        'Content-Type': 'image/*'
      }
    })
    // let regex = /gzip_/g
    imgPathNames.data.forEach((item) => {
      if (item.includes('gzip_')) {
        setMyGzipData((draft) => {
          draft.push({src: item, key: draft.length})
        })
      } else {
        setMyData((draft) => {
          draft.push({src: item, key: draft.length})
        })
      }
    })
    message.success("上传成功")
  }
}

function save(name, myData, myGzipData) {
  return async function () {
    let imgs = []
    let gzipImgs = []
    myData.forEach((item) => {
      imgs.push(item.src)
    })
    myGzipData.forEach((item) => {
      gzipImgs.push(item.src)
    })
    await service.post(`/api/albums`, {
      name,
      time: +new Date(),
      images: imgs,
      gzipImages: gzipImgs,
      lastModified: +new Date(),
      views: 0,
      comments: []
    })
    await service.patch('/api/updateInfoLastModified')
    message.success("保存成功")
    navigator('/album')
  }
}

function select(setToDelete) {
  return function (selectedRowKeys) {
    setToDelete(selectedRowKeys)
  }
}

function deleteAlbums(toDelete, setMyGzipData, setMyData) {
  return function () {
    setMyData((draft) => {
      toDelete.forEach((item) => {
        draft.forEach((itemx, index) => {
          if (itemx.key === item) {
            draft.splice(index, 1)
          }
        })
      })
    })
    setMyGzipData((draft) => {
      toDelete.forEach((item) => {
        draft.forEach((itemx, index) => {
          if (itemx.key === item) {
            draft.splice(index, 1)
          }
        })
      })
    })
  }
}

export default memo(function AlbumPublishPage() {
  const{loading,setLoading}=store;
  navigator = useNavigate()
  const [name, setName] = useState()
  const [toDelete, setToDelete] = useState([])
  const [myData, setMyData] = useImmer([])
  const [myGzipData, setMyGzipData] = useImmer([])
  useEffect(()=>{
    fileCount=0;
  },[])
  return (
      <div>
        <Space>
          <Button type={'primary'} onClick={deleteAlbums(toDelete, setMyGzipData, setMyData)}>删除</Button>
          <Upload beforeUpload={() => false} onChange={onChange(loading,setLoading)} multiple={true}>
            <Button icon={<UploadOutlined/>}>上传照片</Button>
          </Upload>
          <Button type={'primary'} onClick={upLoad(setMyData, setMyGzipData, myData, myGzipData)}>上传</Button>
          相册名称： <Input value={name} onChange={(e) => {
          setName(e.target.value)
        }}/>
        </Space>
        <Table rowSelection={{onChange: select(setToDelete)}}
               columns={columns}
               dataSource={myGzipData}
               maxCount={10}
               pagination={{pageSize: 20}}/>

        <Space>
          <Button type={'primary'}
                  onClick={save(name, myData, myGzipData)}>保存</Button>
          <Button type={'primary'} onClick={() => {
            navigator('/album')
          }}>取消</Button>
        </Space>
      </div>
  )
});

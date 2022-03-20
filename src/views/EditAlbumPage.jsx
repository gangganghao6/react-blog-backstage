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

let formData = new FormData();
let imgPathNames, uploaded = false, navigator;
let fileCount = 0;
let firstInput = true;

function getAlbumData(id) {
  return function () {
    return axios.get(`/api/albums/${id}`)
  }
}

const columns = [
  {
    title: '序号',
    dataIndex: 'key',
  },
  {
    title: '预览',
    dataIndex: 'src',
    render: (e) => {
      return (<Image height={100} src={`${window.url}${e}`}/>)
    },
  },
  {
    title: '名称',
    dataIndex: 'src',
    // render: (text,item) => {
    //   return <a>{text}</a>
    // },
  }
]

function onChange(info) {

  uploaded = true;
  if (firstInput) {
    message.loading('正在处理...')
    firstInput = false;
  }
  formData.append(info.file.name, info.file, info.file.name);
  new Compressor(info.file, {
    quality: 0.1,
    convertTypes: ['image/png', 'image/webp'],
    convertSize: 1000000,
    success(result) {
      formData.append(`gzip_${info.file.name}`, result, `gzip_${info.file.name}`);
      fileCount++;
      if (fileCount === info.fileList.length) {
        alert('处理完成')
        firstInput = true;
      }
    },
    error(err) {
      console.log(err.message);
    },
  });
}

function upLoad(firstTime, setMyData, setMyGzipData) {
  return async function () {
    imgPathNames = await axios.patch('/api/updateAlbums', formData, {
      headers: {
        'Content-Type': 'image/*'
      },
      params: {
        path: `${dayjs(firstTime).format('YYYY-MM-DD')}`,
      }
    })
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
    alert("上传成功")
  }
}

function save(id, name, comments, firstTime, deletedCount, myData, myGzipData) {
  return async function () {
    let imgs = []
    let gzipImgs = []
    myData.forEach((item) => {
      imgs.push(item.src)
    })
    myGzipData.forEach((item) => {
      gzipImgs.push(item.src)
    })
    await axios.patch(`/api/albums/${id}`, {
      name,
      comments,
      images: imgs,
      gzipImages: gzipImgs,
      lastModified: +new Date()
    })
    let info = await axios.get('/api/info')
    await axios.patch('/api/info', {
      commentCount: info.data.commentCount - deletedCount,
    })
    await axios.patch('/api/updateInfoLastModified')
    message.success("保存成功")
    navigator('/album')
  }
}

function select(setToDelete) {
  return function (selectedRowKeys, selectedRows) {
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

export default memo(function EditAlbumPage() {
  let {id} = useParams()
  navigator = useNavigate()
  const {refresh, setRefresh} = store;
  let tempComments = [], tempName = '', firstTime = ''
  const [deletedCount, setDeletedCount] = useState(0)
  const [name, setName] = useState(0)
  const [toDelete, setToDelete] = useState([])
  const [myData, setMyData] = useImmer([])
  const [myGzipData, setMyGzipData] = useImmer([])
  let {data = {data: {gzipImages: [], images: [], comments: []}}} = useRequest(getAlbumData(id))
  if (data) {
    tempComments = data.data.comments;
    tempName = data.data.name;
    firstTime = data.data.time
  }
  useEffect(() => {
    setName(tempName)
    setMyData((draft) => {
      data.data.images.forEach((item, index) => {
        draft.push({src: item, key: index})
      })
    })
    setMyGzipData((draft) => {
      data.data.gzipImages.forEach((item, index) => {
        draft.push({src: item, key: index})
      })
    })
  }, [data])
  return (
      <div>
        <Space>
          <Button type={'primary'} onClick={deleteAlbums(toDelete, setMyGzipData, setMyData)}>删除</Button>
          <Upload beforeUpload={() => false} onChange={onChange} multiple={true}>
            <Button icon={<UploadOutlined/>}>上传照片</Button>
          </Upload>
          <Button type={'primary'} onClick={upLoad(firstTime, setMyData, setMyGzipData)}>上传</Button>
          相册名称： <Input value={name} onChange={(e) => {
          setName(e.target.value)
        }}/>
        </Space>
        <Table rowSelection={{onChange: select(setToDelete)}}
               columns={columns}
               dataSource={myGzipData}
               pagination={{pageSize: 20}}/>
        <Comments comments={tempComments} refresh={refresh} setRefresh={setRefresh}
                  setDeletedCount={setDeletedCount}
                  deletedCount={deletedCount}/>
        <Space>
          <Button type={'primary'}
                  onClick={save(id, name, tempComments, firstTime, deletedCount, myData, myGzipData)}>保存</Button>
          <Button type={'primary'} onClick={() => {
            navigator('/album')
          }}>取消</Button>
        </Space>
      </div>
  )
});

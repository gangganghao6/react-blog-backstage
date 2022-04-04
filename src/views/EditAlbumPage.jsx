import {memo, useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {useRequest} from 'ahooks';
import {
 Button,
 Divider,
 Drawer,
 Image,
 Input,
 List,
 message,
 Pagination,
 Popconfirm, Progress,
 Radio,
 Space,
 Table,
 Upload
} from 'antd';
import {UploadOutlined} from '@ant-design/icons';
import Comments from '../components/Comments';
import store from '../reducer/resso';
import {service} from '../requests/request';
import SelectEditAlbumPost from '../components/SelectEditAlbumPost';

let refreshImages = false;
let formData = new FormData();
let imgPathNames,
    uploaded = false,
    navigator;
let fileCount = 0;
let firstInput = true;

function getAlbumData(id) {
 return function () {
  return service.get(`/api/albums/${id}`);
 };
}

function deleteImage(id) {
 return function () {
  service.delete('/api/albums/images', {
   data: {ids: [id]}
  });
  refreshImages = !refreshImages;
  service.put('/api/info')
  message.success('删除成功');
 };
}

const columns = [
 {
  title: 'ID',
  dataIndex: 'id',
 },
 {
  title: '预览',
  dataIndex: 'gzipSrc',
  render: (e) => {
   return <Image height={'25%'} width={'25%'} src={`${e}`}/>;
  },
 },
 {
  title: 'Src',
  dataIndex: 'originSrc',
  render: (text) => {
   return <a href={text} target={'_blank'}>{text}</a>;
  },
 },
 {
  title: '操作',
  render: (e, item) => {
   return (<Popconfirm
       title="确认删除这张照片吗？"
       onConfirm={deleteImage(item.id)}
       okText="确认"
       cancelText="取消"
   >
    <Button type={'primary'} ghost key="comment-basic-reply-to">
     删除
    </Button>
   </Popconfirm>);
  },
 },
];

function onChange(setLoading, setPercent) {
 return function (info) {
  uploaded = true;
  if (!firstInput) {
   setPercent(0);
   setLoading(true);
   firstInput = false;
  }
  formData.append('files', info.file, info.file.name);
  fileCount++;
  if (fileCount === info.fileList.length - 1) {
   setLoading(false);
   firstInput = true;
   message.success('处理完成...');
  }
 };
}

function upLoad(setPercent) {
 return async function(){
  imgPathNames = await service.post(`/api/albums/images`, formData, {
   headers: {
    'Content-Type': 'image/*',
   },
   onUploadProgress: (progressEvent) => {
    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
    setPercent(percentCompleted);
   }
  });
  message.success('上传成功');
 }
}

function save(id, name, postOriginSrc) {
 return async function () {
  const result = await service.put(`/api/albums/${id}`, {
   name,
   images: imgPathNames ? imgPathNames.data.data : [],
   lastModified: +new Date(),
  });
  if (imgPathNames) {
   for (const item of result.data.data.images) {
    if (item.originSrc === postOriginSrc) {
     await service.put(`/api/albums/${result.data.data.id}`, {
      postId: item.id
     });
    }
   }
  } else if (postOriginSrc) {
   await service.put(`/api/albums/${result.data.data.id}`, {
    postId: postOriginSrc
   });
  }
  await service.put('/api/info');
  message.success('保存成功');
  navigator('/album');
 };
}


export default memo(function EditAlbumPage() {
 let {id} = useParams();
 navigator = useNavigate();
 const {refresh, setRefresh,loading, setLoading} = store;
 const [name, setName] = useState('');
 const [comments, setComments] = useState([]);
 const [postOriginSrc, setPostOriginSrc] = useState(undefined);
 const [images, setImages] = useState([]);
 const [visible, setVisible] = useState(false);
 const [page, setPage] = useState(1);
 const [percent, setPercent] = useState(0);
 let {data, loading: loadingx} = useRequest(getAlbumData(id), {
  refreshDeps: [id, refresh, refreshImages],
 });
 const showDrawer = () => {
  setVisible(true);
 };

 useEffect(() => {
  if (data) {
   setName(data.data.data.name);
   setComments(data.data.data.comments);
   setPostOriginSrc(data.data.data.postId);
   setImages(data.data.data.images);
  }
 }, [loadingx]);
 useEffect(() => {
  return function () {
   fileCount = 0;
   imgPathNames = undefined;
  };
 }, []);
 return (
     <div>
      <Space>
       <Progress type="circle" percent={percent} format={() => {
        let message = '';
        if (percent === 100) {
         message = '压缩中...';
        } else {
         message = `${percent}%`;
        }
        if (!loading) {
         message = '完成';
        }
        return message;
       }}/>
       <Upload beforeUpload={() => false} onChange={onChange(setLoading,setPercent)} multiple={true}>
        <Button icon={<UploadOutlined/>}>上传照片</Button>
       </Upload>
       <Button type={'primary'} onClick={upLoad(setPercent)}>
        上传
       </Button>
       相册名称：{' '}
       <Input
           value={name}
           onChange={(e) => {
            setName(e.target.value);
           }}
       />
       <Button type={'primary'} ghost onClick={showDrawer}>自定义封面</Button>
       <SelectEditAlbumPost postOriginSrc={postOriginSrc} imgPathNames={imgPathNames} visible={visible}
                   setPostOriginSrc={setPostOriginSrc} data={data}
                   setVisible={setVisible} page={page} setPage={setPage}/>
      </Space>
      <Table
          columns={columns}
          dataSource={images}
          pagination={{pageSize: 20}}
      />
      <Space>
       <Button type={'primary'} onClick={save(id, name, postOriginSrc)}>
        保存
       </Button>
       <Button
           type={'primary'}
           onClick={() => {
            navigator('/album');
           }}
       >
        取消
       </Button>
      </Space>
      <Comments
          comments={comments}
          type={'albums'}
          setRefresh={setRefresh}
      />

     </div>
 );
});

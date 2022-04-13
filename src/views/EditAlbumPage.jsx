import {memo, useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {useRequest} from 'ahooks';
import {
 Button,
 Image,
 Input,
 message,
 Popconfirm, Progress,
 Space,
 Table,
 Upload
} from 'antd';
import {UploadOutlined} from '@ant-design/icons';
import Comments from '../components/Comments';
import store from '../reducer/resso';
import {service} from '../requests/request';
import SelectEditAlbumPost from '../components/SelectEditAlbumPost';
import {onChange, upLoad} from '../utils/albums';
let refreshImages = false;
let navigator;

function getAlbumData(id) {
 return function () {
  return service.get(`/api/albums/${id}`);
 };
}

function deleteImage(id) {
 return async function () {
  await service.delete('/api/albums/images', {
   data: {ids: [id]}
  });
  refreshImages = !refreshImages;
  await service.put('/api/info');
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
   const isNew = item?.isNew;
   return (isNew ? <>新上传</> : <Popconfirm
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



function save(id, name, postOriginSrc, images) {
 return async function () {
  const result = await service.put(`/api/albums/${id}`, {
   name,
   images,
   lastModified: +new Date(),
  });
  for (const item of result.data.data.images) {
   if (item.originSrc === postOriginSrc) {
    await service.put(`/api/albums/${result.data.data.id}`, {
     postId: item.id
    });
    break;
   }
  }
  await service.put('/api/info');
  message.success('保存成功');
  navigator('/album');
 };
}


export default memo(function EditAlbumPage() {
 let {id} = useParams();
 navigator = useNavigate();
 const {refresh, setRefresh, loading, setLoading} = store;
 const [name, setName] = useState('');
 const [comments, setComments] = useState([]);
 const [postOriginSrc, setPostOriginSrc] = useState(undefined);
 const [images, setImages] = useState([]);
 const [visible, setVisible] = useState(false);
 const [page, setPage] = useState(1);
 const [percent, setPercent] = useState(0);
 const [uploadList, setUploadList] = useState([]);
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
 return (
     <div>
      <Space>
       <Progress type="circle" percent={percent} format={() => {
        let message = `${percent}%`;
        if (!loading) {
         message = '完成';
        }
        return message;
       }}/>
       <Upload beforeUpload={() => false} onChange={onChange(setUploadList)} multiple={true} showUploadList={{
        showRemoveIcon: false
       }} accept={'image/*'} fileList={uploadList}>
        <Button icon={<UploadOutlined/>}>选择照片</Button>
       </Upload>
       <Button type={'primary'} onClick={upLoad(setPercent, setImages, uploadList, setUploadList)}>
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
       <SelectEditAlbumPost postOriginSrc={postOriginSrc} images={images} visible={visible}
                            setPostOriginSrc={setPostOriginSrc}
                            setVisible={setVisible} page={page} setPage={setPage}/>
      </Space>
      <Table
          columns={columns}
          dataSource={images}
          pagination={{pageSize: 20}}
      />
      <Space>
       <Button type={'primary'} onClick={save(id, name, postOriginSrc, images)}>
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

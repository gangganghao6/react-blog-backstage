import {memo, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {
 Button,
 Image,
 Input,
 message,
 Progress,
 Space,
 Table,
 Upload
} from 'antd';
import {UploadOutlined} from '@ant-design/icons';
import store from '../reducer/resso';
import {service} from '../requests/request';
import SelectPublishAlbumPost from '../components/SelectPublishAlbumPost';
import {onChange, upLoad} from '../utils/albums';
let navigator;

const columns = [
 {
  title: '序号',
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
 }
];



function save(name, postOriginSrc, images) {
 return async function () {
  if(images.length=== 0) {
   message.error('请先上传图片');
   return;
  }
  const result = await service.post(`/api/albums`, {
   name,
   images: images,
   lastModified: +new Date(),
   time: +new Date(),
   comments: [],
   view: 0,
   postId: 1
  });
  for (const item of result.data.data.images) {
   if (item.originSrc === postOriginSrc) {
    await service.put(`/api/albums/${result.data.data.id}`, {
     postId: item.id
    });
   }
  }
  await service.put('/api/info');
  message.success('保存成功');
  navigator('/album');
 };
}


export default memo(function EditAlbumPage() {
 navigator = useNavigate();
 const {loading, setLoading} = store;
 const [name, setName] = useState('');
 const [postOriginSrc, setPostOriginSrc] = useState(undefined);
 const [images, setImages] = useState([]);
 const [visible, setVisible] = useState(false);
 const [page, setPage] = useState(1);
 const [percent, setPercent] = useState(0);
 const [uploadList, setUploadList] = useState([]);
 const showDrawer = () => {
  setVisible(true);
 };

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
       <Upload beforeUpload={() => false} onChange={onChange(setUploadList)} multiple={true}
               showUploadList={{
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
       <SelectPublishAlbumPost postOriginSrc={postOriginSrc} images={images} visible={visible}
                               setPostOriginSrc={setPostOriginSrc}
                               setVisible={setVisible} page={page} setPage={setPage}/>
      </Space>
      <Table
          columns={columns}
          dataSource={images}
          pagination={{pageSize: 20}}
      />
      <Space>
       <Button type={'primary'} onClick={save(name, postOriginSrc, images)}>
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
     </div>
 );
});

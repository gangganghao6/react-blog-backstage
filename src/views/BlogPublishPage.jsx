import {memo, useState} from 'react';

import {Button, Input, Space, Upload, message, Radio, Checkbox, Progress} from 'antd';
import {useNavigate} from 'react-router-dom';
import '../assets/style/blogContent.scss';
import BlogEditor from '../components/BlogEditor';
import {UploadOutlined} from '@ant-design/icons';
import store from '../reducer/resso';
import {service} from '../requests/request';
import SelectPublishAlbumPost from '../components/SelectPublishAlbumPost';
import {onChange, upLoad} from '../utils/blogs';

let navigator;
let needToUpload = false;


function publish(title, content, type, tag, recommend, postOriginSrc, images) {
 return async function () {
  if (title === '' || tag === '' || needToUpload || postOriginSrc === undefined) {
   message.error('还有东西没填哦');
   return;
  }
  const result = await service.post('/api/blogs', {
   type,
   title,
   content: content,
   time: +new Date(),
   recommend,
   images,
   comments: [],
   tag: tag,
   lastModified: +new Date(),
   postId: 1,
   view: 0,
  });
  for (const item of result.data.data.images) {
   if (item.originSrc === postOriginSrc) {
    await service.put(`/api/blogs/${result.data.data.id}`, {
     postId: item.id
    });
   }
  }
  await service.put('/api/info');
  message.success('发布成功');
  navigator('/bloglist');
 };
}

export default memo(function () {
 const [content, setContent] = useState('');
 const [title, setTitle] = useState('');
 const [type, setType] = useState(1);
 const [tag, setTag] = useState('');
 const {loading, setLoading} = store;
 const [recommend, setRecommend] = useState(false);
 const [postOriginSrc, setPostOriginSrc] = useState(undefined);
 const [visible, setVisible] = useState(false);
 const [page, setPage] = useState(1);
 const [percent, setPercent] = useState(0);
 const [images, setImages] = useState([]);
 const [uploadList, setUploadList] = useState([]);
 const showDrawer = () => {
  setVisible(true);
 };
 navigator = useNavigate();
 return (
     <>
      <div className={'blog-content'}>
       <Space style={{paddingBottom: '10px', textAlign: 'left'}}>
        <Progress type="circle" percent={percent} format={() => {
         let message = `${percent}%`;
         if (!loading) {
          message = '完成';
         }
         return message;
        }}/>
        <Upload beforeUpload={() => false}
                onChange={onChange(setContent, setLoading, setPercent, uploadList, setUploadList,needToUpload)} directory
                showUploadList={{
                 showRemoveIcon: false
                }} fileList={uploadList}>
         <Button icon={<UploadOutlined/>}>选择MarkDown文件夹</Button>
        </Upload>
        <Button type={'primary'}
                onClick={upLoad(content, setContent, setPercent, setImages, uploadList, setUploadList,needToUpload)}>
         上传图片
        </Button>
        标题：
        <Input
            onChange={(e) => {
             setTitle(e.target.value);
            }}
        />
        分类：
        <Input
            onChange={(e) => {
             setTag(e.target.value);
            }}
        />
        样式：
        <Radio.Group
            onChange={(e) => {
             setType(e.target.value);
            }}
            value={type}
        >
         <Radio value={1}>1</Radio>
         <Radio value={2}>2</Radio>
        </Radio.Group>
        <Checkbox
            onChange={() => {
             setRecommend(!recommend);
            }}
            checked={recommend}
        >
         推荐
        </Checkbox>
        <Button type={'primary'} ghost onClick={showDrawer}>自定义封面</Button>
        <SelectPublishAlbumPost postOriginSrc={postOriginSrc} images={images} visible={visible}
                                setPostOriginSrc={setPostOriginSrc}
                                setVisible={setVisible} page={page} setPage={setPage}/>
       </Space>
       <BlogEditor content={content} setContent={setContent}/>
       <div className={'action-container'}>
        <Space>
         <Button type={'primary'} onClick={publish(title, content, type, tag, recommend, postOriginSrc, images)}>
          发布
         </Button>
         <Button
             type={'primary'}
             onClick={() => {
              navigator('/bloglist');
             }}
         >
          取消
         </Button>
        </Space>
       </div>
      </div>
     </>
 );
});

import {memo, useEffect, useState} from 'react';

import {Button, Checkbox, Input, message, Progress, Radio, Space, Upload} from 'antd';
import {useNavigate, useParams} from 'react-router-dom';
import '../assets/style/blogContent.scss';
import Comments from '../components/Comments';
import BlogEditor from '../components/BlogEditor';
import {useRequest} from 'ahooks';
import store from '../reducer/resso';
import {UploadOutlined} from '@ant-design/icons';
import {service} from '../requests/request';
import SelectEditBlogPost from '../components/SelectEditBlogPost';
import {onChange, upLoad} from '../utils/blogs';

let navigator;
let needToUpload = false;


function getBlogDetail(id) {
 return function () {
  return service.get('/api/blogs/' + id);
 };
}

function save(id, title, content, tag, type, recommend, postOriginSrc, images) {
 return async function () {
  if (images.length > 0) {
   await service.delete(`/api/blogs/images/${id}`);
  }
  const result = await service.put(`/api/blogs/${id}`, {
   title,
   content,
   tag,
   type,
   lastModified: +new Date(),
   recommend,
   images,
  });
  for (const item of result.data.data.images) {
   if (item.originSrc === postOriginSrc) {
    await service.put(`/api/blogs/${result.data.data.id}`, {
     postId: item.id
    });
   }
  }
  await service.put('/api/info');
  message.success('保存成功');
  navigator('/bloglist');
 };
}

function cancel() {
 navigator('/bloglist');
}

export default memo(function EditBlogPage({my}) {
 navigator = useNavigate();
 let {id} = useParams();
 id = my ? my : id;
 let {refresh, setRefresh, loading, setLoading} = store;
 const [content, setContent] = useState('');
 const [title, setTitle] = useState('');
 const [type, setType] = useState(1);
 const [tag, setTag] = useState('');
 const [recommend, setRecommend] = useState(false);
 const [comments, setComments] = useState([]);
 const [postOriginSrc, setPostOriginSrc] = useState(undefined);
 const [visible, setVisible] = useState(false);
 const [page, setPage] = useState(1);
 const [percent, setPercent] = useState(0);
 const [images, setImages] = useState([]);
 const [uploadList, setUploadList] = useState([]);
 const showDrawer = () => {
  setVisible(true);
 };
 let {data, loading: loadingx} = useRequest(getBlogDetail(id), {
  refreshDeps: [id, refresh],
 });
 useEffect(() => {
  if (data) {
   setContent(data.data.data.content);
   setType(data.data.data.type);
   setTitle(data.data.data.title);
   setTag(data.data.data.tag);
   setRecommend(data.data.data.recommend);
   setComments(data.data.data.comments);
   setPostOriginSrc(data.data.data.postId);
   setImages(data.data.data.images);
  }
 }, [loadingx]);


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
                onChange={onChange(setContent, setLoading, setPercent, uploadList, setUploadList, needToUpload)}
                directory
                showUploadList={{
                 showRemoveIcon: false
                }} fileList={uploadList}>
         <Button icon={<UploadOutlined/>}>选择MarkDown文件夹</Button>
        </Upload>
        <Button type={'primary'}
                onClick={upLoad(content, setContent, setPercent, setImages, uploadList, setUploadList, needToUpload)}>
         上传图片
        </Button>
        标题：
        <Input
            value={title}
            onChange={(e) => {
             setTitle(e.target.value);
            }}
        />
        分类：
        <Input
            value={tag}
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
        <SelectEditBlogPost postOriginSrc={postOriginSrc} images={images} visible={visible}
                            setPostOriginSrc={setPostOriginSrc}
                            setVisible={setVisible} page={page} setPage={setPage}/>
       </Space>
       <BlogEditor content={content} setContent={setContent}/>
       <div className={'action-container'}>
        <Space>
         <Button
             type={'primary'}
             onClick={save(id, title, content, tag, type, recommend, postOriginSrc, images)}
         >
          保存更改
         </Button>
         <Button type={'primary'} onClick={cancel}>
          取消
         </Button>
        </Space>
       </div>
       <Comments
           comments={comments}
           setRefresh={setRefresh}
           type={'blogs'}
       />
      </div>
     </>
 );
});

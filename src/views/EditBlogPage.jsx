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

let formData = new FormData();
let navigator;
let fileCount = 0;
let firstInput = true;
let uploaded = false;

function onChange(setContent, setLoading, setPercent) {
 return async function (info) {
  uploaded = true;
  if (firstInput) {
   setPercent(0);
   setLoading(true);
   firstInput = false;
  }
  let reg = /\.md$/;
  if (reg.exec(info.file.name) !== null) {
   let reader = new FileReader();
   reader.readAsText(info.file, 'utf8');
   reader.onload = () => {
    setContent(reader.result);
   };
  } else {
   formData.append('files', info.file, info.file.name);
   fileCount++;
   if (fileCount === info.fileList.length - 1) {
    firstInput = false;
    message.success('处理完成');
    setLoading(false);
   }
  }
 };
}

function upLoad(content, setContent, setPercent, setImages) {
 return async function () {
  setImages([]);
  const allImages = [];
  for (const file of formData.entries()) {
   const tempFormData = new FormData();
   tempFormData.append('files', file[1], file[1].name);
   const res = await service.post(`/api/blogs/images`, tempFormData, {
    onUploadProgress: (progressEvent) => {
     const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
     setPercent(percentCompleted);
    }
   });
   allImages.push(res.data.data[0]);
   setImages((prev) => [...prev, res.data.data[0]]);
  }
  formData = new FormData();
  let reg = /!\[(.*?)\]\((.*?)\)/gm;
  let matcher;
  let tempContent = content;
  let imgLength = allImages.length;
  for (let index = 0; index < imgLength; index++) {
   let fileName = allImages[index].imageName;
   for (let indexy = 0; (matcher = reg.exec(content)) !== null; indexy++) {
    if (matcher[2].includes(fileName)) {
     tempContent = tempContent.replace(matcher[0], `![img](${allImages[index].originSrc})`);
    }
   }
  }
  setContent(tempContent);
  message.success('上传成功');
 };
}


function getBlogDetail(id) {
 return function () {
  return service.get('/api/blogs/' + id);
 };
}

function save(id, title, content, tag, type, recommend, postOriginSrc,images) {
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
 useEffect(() => {
  return function () {
   fileCount = 0;
   formData = new FormData();
  };
 }, []);

 return (
     <>
      <div className={'blog-content'}>
       <Space style={{paddingBottom: '10px', textAlign: 'left'}}>
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
        <Upload beforeUpload={() => false} onChange={onChange(setContent, setLoading, setPercent)} directory>
         <Button icon={<UploadOutlined/>}>上传MarkDown文件夹</Button>
        </Upload>
        <Button type={'primary'} onClick={upLoad(content, setContent, setPercent,setImages)}>
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
             onClick={save(id, title, content, tag, type, recommend, postOriginSrc,images)}
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

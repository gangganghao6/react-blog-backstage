import {memo, useEffect, useState} from 'react';

import {Button, Checkbox, Drawer, Image, Input, message, Radio, Space, Upload} from 'antd';
import {useNavigate, useParams} from 'react-router-dom';
import '../assets/style/blogContent.scss';
import Comments from '../components/Comments';
import BlogEditor from '../components/BlogEditor';
import {useRequest} from 'ahooks';
import axios from 'axios';
import dayjs from 'dayjs';
import store from '../reducer/resso';
import {UploadOutlined} from '@ant-design/icons';
import {service} from '../requests/request';
import SelectEditBlogPost from '../components/SelectEditBlogPost';

let formData = new FormData();
let imgPathNames, navigator;
let fileCount = 0;
let firstInput = true;
let uploaded = false;

function onChange(setContent, setLoading) {
 return async function (info) {
  uploaded = true;
  if (firstInput) {
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

function upLoad(content, setContent) {
 return async function () {
  imgPathNames = await service.post('/api/blogs/images', formData, {
   headers: {
    'Content-Type': 'image/*',
   },
  });
  let reg = /!\[(.*?)\]\((.*?)\)/gm;
  let matcher;
  let tempContent = content;
  let imgLength = imgPathNames.data.data.length;
  for (let index = 0; index < imgLength; index++) {
   let fileName = imgPathNames.data.data[index].imageName;
   for (let indexy = 0; (matcher = reg.exec(content)) !== null; indexy++) {
    if (matcher[2].includes(fileName)) {
     tempContent = tempContent.replace(matcher[0], `![img](${imgPathNames.data.data[index].originSrc})`);
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

function save(id, title, content, tag, type, recommend, postOriginSrc) {
 return async function () {
  if (imgPathNames) {
   await service.delete(`/api/blogs/images/${id}`);
  }
  const result = await service.put(`/api/blogs/${id}`, {
   title,
   content,
   tag,
   type,
   lastModified: +new Date(),
   recommend,
   images: imgPathNames ? imgPathNames.data.data : [],
  });
  if (imgPathNames) {
   for (const item of result.data.data.images) {
    if (item.originSrc === postOriginSrc) {
     await service.put(`/api/blogs/${result.data.data.id}`, {
      postId: item.id
     });
    }
   }
  } else if (postOriginSrc) {
   await service.put(`/api/blogs/${result.data.data.id}`, {
    postId: postOriginSrc
   });
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
 let {refresh, setRefresh, setLoading} = store;
 const [content, setContent] = useState('');
 const [title, setTitle] = useState('');
 const [type, setType] = useState(1);
 const [tag, setTag] = useState('');
 const [recommend, setRecommend] = useState(false);
 const [comments, setComments] = useState([]);
 const [postOriginSrc, setPostOriginSrc] = useState(undefined);
 const [visible, setVisible] = useState(false);
 const [page, setPage] = useState(1);
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
   setPostOriginSrc(data.data.data.postId)
  }
 }, [loadingx]);
 useEffect(() => {
  return function () {
   fileCount = 0;
   imgPathNames = undefined;
   formData = new FormData();
  }
 }, []);

 return (
     <>
      <div className={'blog-content'}>
       <Space style={{paddingBottom: '10px', textAlign: 'left'}}>
        <Upload beforeUpload={() => false} onChange={onChange(setContent, setLoading)} directory>
         <Button icon={<UploadOutlined/>}>上传MarkDown文件夹</Button>
        </Upload>
        <Button type={'primary'} onClick={upLoad(content, setContent)}>
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
        <SelectEditBlogPost postOriginSrc={postOriginSrc} imgPathNames={imgPathNames} visible={visible}
                            setPostOriginSrc={setPostOriginSrc} data={data}
                            setVisible={setVisible} page={page} setPage={setPage}/>
       </Space>
       <BlogEditor content={content} setContent={setContent}/>
       <div className={'action-container'}>
       <Space>
        <Button
            type={'primary'}
            onClick={save(id, title, content, tag, type, recommend, postOriginSrc)}
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

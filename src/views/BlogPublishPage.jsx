import {memo, useEffect, useState} from 'react';

import {Button, Image, Input, Space, Upload, message, Radio, Checkbox, Drawer, Progress} from 'antd';
import {useNavigate, useParams} from 'react-router-dom';
import '../assets/style/blogContent.scss';
import BlogEditor from '../components/BlogEditor';
import {UploadOutlined} from '@ant-design/icons';
import axios from 'axios';
import store from '../reducer/resso';
import {service} from '../requests/request';
import SelectPublishAlbumPost from '../components/SelectPublishAlbumPost';

let formData = new FormData();
let imgPathNames = undefined, navigator;
let uploaded = false;
let firstInput = true;
let fileCount = 0;

function onChange(setContent, loading, setLoading,setPercent) {
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
    setLoading(false);
   }
  }
 };
}

function upLoad(content, setContent,setPercent) {
 return async function () {
  imgPathNames = await service.post('/api/blogs/images', formData, {
   headers: {
    'Content-Type': 'image/*',
   }, onUploadProgress: (progressEvent) => {
    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
    setPercent(percentCompleted);
   }
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

function publish(title, content, type, tag, recommend, postOriginSrc) {
 return async function () {
  if (title === '' || tag === '' || uploaded === false || postOriginSrc === undefined) {
   message.error('还有东西没填哦');
   return;
  }
  const result = await service.post('/api/blogs', {
   type,
   title,
   content: content,
   time: +new Date(),
   recommend,
   images: imgPathNames ? imgPathNames.data.data : [],
   comments: [],
   tag: tag,
   lastModified: +new Date(),
   postId: 1,
   view: 0,
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
  message.success('发布成功');
  navigator('/bloglist');
 };
}

function beforeUpload() {
 return false;
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
 const showDrawer = () => {
  setVisible(true);
 };
 navigator = useNavigate();
 useEffect(() => {
  return function () {
   fileCount = 0;
   imgPathNames = undefined;
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
        <Upload beforeUpload={beforeUpload} onChange={onChange(setContent, loading, setLoading, setPercent)} directory>
         <Button icon={<UploadOutlined/>}>上传MarkDown文件夹</Button>
        </Upload>
        <Button type={'primary'} onClick={upLoad(content, setContent, setPercent)}>
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
        <SelectPublishAlbumPost postOriginSrc={postOriginSrc} imgPathNames={imgPathNames} visible={visible}
                                setPostOriginSrc={setPostOriginSrc}
                                setVisible={setVisible} page={page} setPage={setPage}/>
       </Space>
       <BlogEditor content={content} setContent={setContent}/>
       <div className={'action-container'}>
        <Space>
         <Button type={'primary'} onClick={publish(title, content, type, tag, recommend, postOriginSrc)}>
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

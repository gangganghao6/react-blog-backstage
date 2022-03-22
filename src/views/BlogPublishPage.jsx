import {memo, useEffect, useState} from "react";

import {Button, Image, Input, Space, Upload, message, Radio, Checkbox} from "antd";
import {useNavigate, useParams} from "react-router-dom";
import "../assets/style/blogContent.scss";
import Compressor from 'compressorjs';
import BlogEditor from "../components/BlogEditor";
import {UploadOutlined} from "@ant-design/icons";
import axios from "axios";
import store from "../reducer/resso";
import {service} from "../requests/request";

let formData = new FormData();
let imgPathNames, mdPathName, navigator;
let uploaded = false;
let firstInput=true;
let fileCount=0;

function onChange(setContent, loading, setLoading) {
  return async function (info) {
    uploaded = true;
    if(firstInput){
      setLoading(true);
      firstInput=false;
    }
    let reg = /\.md$/
    if (reg.exec(info.file.name) !== null) {
      let reader = new FileReader();
      reader.readAsText(info.file, 'utf8')
      reader.onload = () => {
        setContent(reader.result)
        fileCount++;
        if(fileCount===info.fileList.length){
          setLoading(false);
          firstInput=true;
          message.success('处理完成')
        }
      }
    } else {
      formData.append(info.file.name, info.file,info.file.name);
      new Compressor(info.file, {
        quality: 0.1,
        convertTypes: ['image/png', 'image/webp'],
        convertSize: 1000000,
        success(result) {
          formData.append(`gzip_${info.file.name}`, result, `gzip_${info.file.name}`);
          fileCount++;
          if(fileCount===info.fileList.length){
            setLoading(false);
            firstInput=true;
            message.success('处理完成')
          }
        },
        error(err) {
          console.log(err.message);
        },
      });
    }
  }
}

function upLoad(content, setContent) {
  return async function () {
    imgPathNames = await service.post('/api/blogImages', formData, {
      headers: {
        'Content-Type': 'image/*'
      }
    })
    let reg = /!\[(.*?)\]\((.*?)\)/mg;
    let matcher;
    let tempContent = content;
    let imgLength = imgPathNames.data.length;
    for (let index = 0; index < imgLength; index++) {
      let splits = imgPathNames.data[index].split('/')
      let fileName = splits[5]
      for (let indexy = 0; (matcher = reg.exec(content)) !== null; indexy++) {
        if (fileName.includes(matcher[1])) {
          tempContent = tempContent.replace(matcher[0], `![img](${imgPathNames.data[index]})`)
        }
      }
    }
    setContent(tempContent)
    message.success("上传成功")
  }
}

function publish(title, content, type, tag, recommend) {
  return async function () {
    if (title === '' || tag === '' || uploaded === false) {
      message.error("还有东西没填哦")
      return;
    }
    let formData = new FormData();
    let file = new File([content], title + '.md')
    formData.append(title + '.md', file);
    mdPathName = await service.post('/api/blogMd', formData, {
      headers: {
        'Content-Type': 'application/md'
      }
    })
    await service.post("/api/blogs", {
      type,
      title,
      content: mdPathName.data[0],
      time: +new Date(),
      recommend,
      images: imgPathNames ? imgPathNames.data : [],
      comments: [],
      tags: tag,
      post: imgPathNames.data[0],
      lastModified: +new Date(),
      views: 0,
    })
    await service.patch("/api/updateInfoBlogs", {
      type: "add"
    })
    await service.patch("/api/updateTags", {
      type: "add",
      tag
    })
    await service.patch('/api/updateInfoLastModified')
    message.success("发布成功")
    navigator('/bloglist')
  }
}

function beforeUpload() {
  return false;
}

export default memo(function () {
  const [content, setContent] = useState('')
  const [title, setTitle] = useState('')
  const [type, setType] = useState(1)
  const [tag, setTag] = useState('')
  const {loading, setLoading} = store;
  const [recommend, setRecommend] = useState(false)
  navigator = useNavigate()
  useEffect(()=>{
    fileCount=0;
  },[])
  return (
      <>
        <div className={"blog-content"}>
          <Space style={{paddingBottom: '10px', textAlign: 'left'}}>
            <Upload beforeUpload={beforeUpload} onChange={onChange(setContent, loading, setLoading)} directory>
              <Button icon={<UploadOutlined/>}>上传MarkDown文件夹</Button>
            </Upload>
            <Button type={'primary'} onClick={upLoad(content, setContent)}>上传图片</Button>
            标题：<Input onChange={(e) => {
            setTitle(e.target.value)
          }}/>
            分类：<Input onChange={(e) => {
            setTag(e.target.value)
          }}/>
            样式：
            <Radio.Group onChange={(e) => {
              setType(e.target.value)
            }} value={type}>
              <Radio value={1}>1</Radio>
              <Radio value={2}>2</Radio>
            </Radio.Group>
            <Checkbox onChange={() => {
              setRecommend(!recommend)
            }} checked={recommend}>推荐</Checkbox>
          </Space>
          <BlogEditor content={content} setContent={setContent}/>
          <div className={'action-container'}>
            <Space>
              <Button type={'primary'} onClick={publish(title, content, type, tag, recommend)}>发布</Button>
              <Button type={'primary'} onClick={() => {
                navigator('/bloglist')
              }}>取消</Button>
            </Space>
          </div>
        </div>
      </>
  );
});

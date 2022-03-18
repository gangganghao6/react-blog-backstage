import {memo, useState} from "react";

import {Button, Image, Input, Space, Upload, message, Radio} from "antd";
import {useNavigate, useParams} from "react-router-dom";
import "../assets/style/blogContent.scss";
import Compressor from 'compressorjs';
import BlogEditor from "../components/BlogEditor";
import {UploadOutlined} from "@ant-design/icons";
import axios from "axios";

let formData = new FormData();
let imgPathNames, mdPathName, uploaded,navigator;
uploaded = false;

function onChange(setContent) {
  return async function (info) {
    uploaded = true;
    let reg = /\.md$/
    if (reg.exec(info.file.name) !== null) {
      let reader = new FileReader();
      reader.readAsText(info.file, 'utf8')
      reader.onload = () => {
        setContent(reader.result)
      }
    } else {
      formData.append(info.file.name, info.file);
      new Compressor(info.file, {
        quality: 0.6,
        convertTypes: ['image/png', 'image/webp'],
        convertSize: 1000000,
        success(result) {
          formData.append(`gzip_${info.file.name}`, result, `gzip_${info.file.name}`);
          // axios.post('/path/to/upload', formData).then(() => {
          //   console.log('Upload success');
          // });
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
    imgPathNames = await axios.post('/api/blogImages', formData, {
      headers: {
        'Content-Type': 'image/*'
      }
    })
    let reg = /!\[(.*?)\]\((.*?)\)/mg;
    let matcher;
    let tempContent = content;
    for (let index = 0; (matcher = reg.exec(content)) !== null; index++) {
      tempContent = tempContent.replace(matcher[0], `![img](http://192.168.31.30:3000${imgPathNames.data[index]})`)
    }
    setContent(tempContent)
    message.success("上传成功")
  }
}

function publish(title, content, type, tag) {
  return async function () {
    if (title === '' || tag === '' || uploaded === false) {
      message.error("还有东西没填哦")
      return;
    }
    let formData = new FormData();
    let file = new File([content], title + '.md')
    formData.append(title + '.md', file);
    mdPathName = await axios.post('/api/blogMd', formData, {
      headers: {
        'Content-Type': 'application/md'
      }
    })
    await axios.post("/api/blogs", {
      type,
      title,
      content: mdPathName.data[0],
      time: +new Date(),
      recommend: false,
      images: imgPathNames.data,
      comments: [],
      tags: tag,
      post: imgPathNames.data[0],
      lastModified: +new Date(),
      views: 0
    })
    await axios.patch("/api/updateInfoBlogs", {
      type: "add"
    })
    await axios.patch("/api/updateTags", {
      type: "add",
      tag
    })
    await axios.patch('/api/updateInfoLastModified')
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
  navigator=useNavigate()
  // let str = 'adfa ![isf](adfdsaff.jpg)ererer'
  // str = str.replace(reg, '![img](http://192.168.31.30:3000/test.jpg)')
  // console.log(str)
  return (
      <>
        <div className={"blog-content"}>
          <Space style={{paddingBottom: '10px', textAlign: 'left'}}>
            <Upload beforeUpload={beforeUpload} onChange={onChange(setContent)} directory>
              <Button icon={<UploadOutlined/>}>上传MarkDown文件</Button>
            </Upload>
            <Button type={'primary'} onClick={upLoad(content, setContent)}>上传图片</Button>
            标题：<Input onChange={(e) => {
            setTitle(e.target.value)
          }}/>
            分类：<Input onChange={(e) => {
            setTag(e.target.value)
          }}/>
            <Radio.Group onChange={(e) => {
              setType(e.target.value)
            }} defaultValue={2}>
              <Radio value={1}>1</Radio>
              <Radio value={2}>2</Radio>
            </Radio.Group>
          </Space>
          <BlogEditor content={content} setContent={setContent}/>
          <div className={'action-container'}>
            <Space>
              <Button type={'primary'} onClick={publish(title, content, type, tag)}>发布</Button>
              <Button type={'primary'}>取消</Button>
            </Space>
          </div>
        </div>
      </>
  );
});

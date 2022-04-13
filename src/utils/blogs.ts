import { message } from 'antd';
import { service } from '../requests/request';

export function onChange(setContent, setLoading, setPercent, uploadList, setUploadList, needToUpload) {
  let fileCount = 0;
  return async function (info) {
    needToUpload = true;
    if (fileCount !== info.fileList.length) {
      setUploadList([]);
    }
    fileCount = info.fileList.length;
    let reg = /\.md$/;
    if (reg.exec(info.file.name) !== null) {
      let reader = new FileReader();
      reader.readAsText(info.file, 'utf8');
      reader.onload = () => {
        setContent(reader.result);
      };
    } else {
      setUploadList((prevList) => {
        return [...prevList, info.file];
      });
    }
  };
}

export function upLoad(content, setContent, setPercent, setImages, uploadList, setUploadList, needToUpload) {
  return async function () {
    needToUpload = false;
    setImages([]);
    const allImages = [];
    let count = 0;
    setPercent(0);
    for (const file of uploadList) {
      const formData = new FormData();
      formData.append('files', file, file.name);
      const res = await service.post(`/api/blogs/images`, formData);
      setPercent((++count / uploadList.length * 100).toFixed(1));
      allImages.push(res.data.data[0]);
      setImages((prev) => {
        return [...prev, res.data.data[0]];
      });
    }
    setUploadList([]);
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

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
    let tempContent = content;
    let reg = /!\[(.*?)\]\((.*?)\)/gm;

    let reg2 = /\<img.*?\/\>/m;//避免全局匹配（重复图片）
    let reg3 = / (src)="(.*?)"/gm;
    let reg4 = / (style)="zoom:(.*?);"/gm;
    let result2;
    while (result2 = reg2.exec(tempContent)) {// 匹配所有的img标签替换为![](图片本地地址)
      let result3 = reg3.exec(result2[0]);
      let result4 = reg4.exec(result2[0]);
      tempContent = tempContent.replace(result2[0], `![${result4[2]}](${result3[2]})`);
      reg3.lastIndex = 0;// 每次替换之后重置正则表达式
      reg4.lastIndex = 0;
    }

    let matcher;
    let imgLength = allImages.length;
    for (let index = 0; index < imgLength; index++) {// 匹配所有的![](图片本地地址)替换为![](图片服务器地址)
      let fileName = allImages[index].imageName;
      for (let indexy = 0; (matcher = reg.exec(tempContent)) !== null; indexy++) {
        if (matcher[2].includes(fileName)) {
          tempContent = tempContent.replace(matcher[0], `![${matcher[1]}](${allImages[index].originSrc})`);
        }
      }
    }
    setContent(tempContent);
    message.success('上传成功');
  };
}

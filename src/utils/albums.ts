import { message } from 'antd';
import {service} from '../requests/request';
export function onChange(setUploadList) {
  return function (info) {
    setUploadList((prevList) => {
      let exist = prevList.some((item) => item.name === info.file.name);
      return exist ? prevList : [...prevList, info.file];
    });
  };
}
export function upLoad(setPercent, setImages, uploadList, setUploadList) {
  return async function () {
    let count = 0;
    setPercent(0);
    for (const file of uploadList) {
      const formData = new FormData();
      formData.append('files', file, file.name);
      const res = await service.post(`/api/albums/images`, formData);
      setPercent((++count / uploadList.length * 100).toFixed(1));
      setImages((prev) => {
        return [...prev, {isNew: true, ...res.data.data[0]}];
      });
    }
    setUploadList([]);
    message.success('上传成功');
  };
}

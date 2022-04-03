import {service} from '../../requests/request';
import dayjs from 'dayjs';

const ONE_DAY_MS = 1000 * 60 * 60 * 24;

export const getDailyActivityData = async () => {
 const result = await service.get('/api/info/visitInfos');
 const realData = new Array(365).fill(0);
 result.data.data.forEach((item) => {
  const date = dayjs(parseInt(item.time)).format('YYYY-MM-DD');
  const index = dayjs(date).diff(dayjs('2022-01-01'), 'day');
  realData[index] = realData[index] + 1;
 });
 const year = new Date().getFullYear();
 const data = realData.map((item, index) => {
  return {
   visitCount: item,
   date: dayjs(`${year}-01-01`).valueOf() + index * ONE_DAY_MS,
   day: new Date(dayjs('2022-01-01').valueOf() + index * ONE_DAY_MS).getDay(),
  };
 });
 let week = 0;
 data.forEach((item) => {
  item.week = week;
  if (item.day === 6) {
   week++;
  }
 });
 return data;
};

export const getTagData = async () => {
 let {data} = await service.get('/api/info/visitInfos');
 const realData = {
  Desktop: 0,
  Mobile: 0
 };
 data.data.forEach((item) => {
  if (item.device === 'Mobile') {
   realData.Mobile++;
  } else if (item.device === 'Desktop') {
   realData.Desktop++;
  }
 });
 let result = [];
 const keys = Object.keys(realData);
 keys.forEach((item) => {
  result.push({device: item, count: realData[item]});
 });
 return result;
};
export const getOSData = async () => {
 let {data} = await service.get('/api/info/visitInfos');
 const myArrary = {};
 data.data.forEach((item) => {
  if (!(item.os in myArrary)) {
   myArrary[item.os] = 1;
  } else {
   myArrary[item.os]++;
  }
 });
 let result = [];
 const keys = Object.keys(myArrary);
 keys.forEach((item) => {
  result.push({os: item, count: myArrary[item]});
 });
 return result;
};
export const getBrowserData = async () => {
 let {data} = await service.get('/api/info/visitInfos');
 const myArrary = {};
 data.data.forEach((item) => {
  if (!(item.browser in myArrary)) {
   myArrary[item.browser] = 1;
  } else {
   myArrary[item.browser]++;
  }
 });
 let result = [];
 const keys = Object.keys(myArrary);
 keys.forEach((item) => {
  result.push({browser: item, count: myArrary[item]});
 });
 return result;
};

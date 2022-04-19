import axios from 'axios';
import store from '../reducer/resso';

export const service = axios.create({});

service.interceptors.request.use(
    (config) => {
     const {setLoading} = store;
     setLoading(true);
     config.headers = {
      Accept: '*/*',
      // "Content-Type": "application/json",
    };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
service.interceptors.response.use(
  (response) => {
    const { setLoading } = store;
    setLoading(false);
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

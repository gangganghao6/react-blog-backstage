import {service} from '../../requests/request';

export let getTotalData= async () => {
 return await service.get('/api/info/visitInfos');
};

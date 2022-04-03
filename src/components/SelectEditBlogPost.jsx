import {memo} from 'react';
import {Drawer, Pagination, Radio, Space} from 'antd';

export default memo(function selectPost({
                                         postOriginSrc,
                                         imgPathNames,
                                         visible,
                                         data,
                                         setPostOriginSrc,
                                         setVisible,
                                         page,
                                         setPage
                                        }) {

 const closeDrawer = () => {
  setVisible(false);
 };
 const selectPost = (e) => {
  setPostOriginSrc(e.target.value);
 };
 return <Drawer title="自定义你的封面" placement="right" onClose={closeDrawer} visible={visible} size={'large'}>
  <Radio.Group onChange={selectPost} value={postOriginSrc}>
   <Space direction="vertical">
    {imgPathNames ? imgPathNames.data.data.slice((page - 1) * 10, page * 10).map((item) => {
     return (<Radio value={item.originSrc}>
      <img src={item.gzipSrc} style={{objectFit: 'cover', width: '100%'}} alt={item.originSrc}/>
     </Radio>);
    }) : (data ? data.data.data.images.slice((page - 1) * 10, page * 10).map((item) => {
     return (<Radio value={item.id}>
      <img src={item.gzipSrc} style={{objectFit: 'cover', width: '100%'}} alt={item.id}/>
     </Radio>);
    }) : '')}
   </Space>
  </Radio.Group>
  <div style={{marginTop: '10px', textAlign: 'center'}}>
   <Pagination pageSize={10}
               total={imgPathNames ? imgPathNames.data.data.length : data ? data.data.data.images.length : 0}
               onChange={setPage}/>
  </div>

 </Drawer>;
});

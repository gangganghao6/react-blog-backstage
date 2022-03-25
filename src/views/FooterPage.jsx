import {memo, useEffect, useState} from "react";
import Footer from "rc-footer";
import {useRequest} from "ahooks";
import axios from "axios";
import '../assets/style/footer.scss'
import "rc-footer/assets/index.css";
import ReactJson from 'react-json-view'
import {useImmer} from "use-immer";
import {Button, message} from "antd";
import {service} from "../requests/request";

function getFooter() {
  return service.get('/api/footer')
}

function onAdd(changed, setChanged, setObj) {
  return function (e) {

  }
}

function onEdit(changed, setChanged, setObj) {
  return function (e) {
    setObj((draft) => {
      draft.data = e.updated_src
    })
    setChanged(!changed)
  }
}

function onDelete(changed, setChanged, setObj) {
  return function (e) {
    setObj((draft) => {
      draft.data = e.updated_src;
    })
    setChanged(!changed)
  }
}

function save(newValue, refresh, setRefresh) {
  return async function () {
    await service.patch('/api/updateFooter', {
      footers: newValue
    })
    await service.patch('/api/updateInfoLastModified')
    message.success('已保存')
    setRefresh(!refresh)
  }
}

export default memo(function FooterPage() {
  let [refresh, setRefresh] = useState(false)
  let [obj, setObj] = useImmer({data: []});
  let [display, setDisplay] = useImmer({data: []});
  let [changed, setChanged] = useState(false)
  let {data = {data: []}} = useRequest(getFooter, {
    refreshDeps: [refresh]
  })
  useEffect(() => {
    setObj((draft) => {
      draft.data = data.data;
    })
    setDisplay((draft) => {
      draft.data = data.data;
    })
    setDisplay((draft) => {
      draft.data.forEach((item) => {
        item.icon = <img src={`${item.post}`} loading={"lazy"} alt={item.post}/>
        item.items.forEach((itemx) => {
          if (itemx.url === '') {
            delete itemx.url
          }
          itemx.openExternal = true;
        })
      })
    })
  }, [data])
  useEffect(() => {
    setDisplay((draft) => {
      draft.data = obj.data;
    })
    setDisplay((draft) => {
      draft.data.forEach((item) => {
        item.icon = <img src={`${item.post}`} loading={"lazy"} alt={item.post}/>
        item.items.forEach((itemx) => {
          if (itemx.url === '') {
            delete itemx.url
          }
          itemx.openExternal = true;
        })
      })
    })
  }, [changed])
  return <div style={{textAlign: 'left'}}>
    <ReactJson theme={'eighties'} onAdd={onAdd(changed, setChanged, setObj)} displayDataTypes={false} src={obj.data}
               onEdit={onEdit(changed, setChanged, setObj)} onDelete={onDelete(changed, setChanged, setObj)}/>
    <div style={{textAlign: 'center', marginTop: '20px'}}>
      <Button type={'primary'} onClick={save(obj.data, refresh, setRefresh)}>保存修改</Button>
    </div>
    <Footer theme={"light"} columns={display.data} bottom={`Made by Pikachu - Powered by React`}/>
  </div>
});

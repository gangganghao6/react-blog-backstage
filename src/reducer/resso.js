import resso from "resso";

const store = resso({
  refresh: false,
  obj: {},
  setRefresh: () => {
    store.refresh = !store.refresh;
  },
  setObj: () => {
    store.obj = {...store.obj, ["date" + store.count]: +new Date()};
    store.addCount();
  },
});
export default store;

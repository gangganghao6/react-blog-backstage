import resso from "resso";

const store = resso({
  refresh: false,
  loading: false,
  obj: {},
  setRefresh: () => {
    store.refresh = !store.refresh;
  },
  setLoading: (set) => {
    store.loading = set;
  },
  setObj: () => {
    store.obj = {...store.obj, ["date" + store.count]: +new Date()};
    store.addCount();
  },
});
export default store;

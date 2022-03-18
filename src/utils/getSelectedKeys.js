function getSelectedKeys(pathName) {
  let index;
  let testResult = /\/(index|bloglist|album|timeline|about|footer|setting)/.exec(pathName);
  testResult = (testResult === null ? '/index' : testResult[0])
  switch (testResult) {
    case "/index":
      index = 1;
      break;
    case "/bloglist":
      index = 2;
      break;
    case "/album":
      index = 3;
      break;
    case "/timeline":
      index = 4;
      break;
    case "/about":
      index = 5;
      break;
    case "/footer":
      index = 6;
      break;
    case "/setting":
      index = 7;
      break;
  }
  return index;
}

const siderItem = [
  {
    text: "博客状态",
    path: "/index",
    key: "1",
  },
  {
    text: "文章",
    path: "/bloglist",
    key: "2",
  },
  {
    text: "相册",
    path: "/album",
    key: "3",
  },
  {
    text: "时间线",
    path: "/timeline",
    key: "4",
  },
  {
    text: "页脚链接",
    path: "/footer",
    key: "5",
  },
  {
    text: "关于我",
    path: "/about",
    key: "6",
  },
  {
    text: "设置",
    path: "/setting",
    key: "7",
  },
];
export {getSelectedKeys, siderItem};

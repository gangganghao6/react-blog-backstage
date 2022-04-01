import { Chart, registerShape } from "@antv/g2";
import { findLastIndex } from "../../utils/helpers";
import dayjs from "dayjs";

registerShape("polygon", "boundary-polygon", {
  draw(cfg, container) {
    const group = container.addGroup();
    const attrs = {
      stroke: "#fff",
      // TODO: 魔法数字，应自适应
      lineWidth: 2,
      fill: cfg.color,
    };
    const points = cfg.points;
    const path = [
      ["M", points[0].x, points[0].y],
      ["L", points[1].x, points[1].y],
      ["L", points[2].x, points[2].y],
      ["L", points[3].x, points[3].y],
      ["Z"],
    ];
    attrs.path = this.parsePath(path);
    group.addShape("path", {
      attrs,
    });
    return group;
  },
});

const MONTH_TEXT_ARRAY = [
  "Jan.",
  "Feb.",
  "Mar.",
  "Apr.",
  "May.",
  "Jun.",
  "Jul.",
  "Aug.",
  "Sept.",
  "Oct.",
  "Nov.",
  "Dec.",
];

const generateWeekLabelMap = (data) => {
  const map = {};
  const alreadyInMapMonth = new Set();
  data.slice(2).forEach((item) => {
    const month = new Date(item.date).getMonth();
    if (alreadyInMapMonth.size >= 11) {
      alreadyInMapMonth.clear();
    }
    if (!alreadyInMapMonth.has(month)) {
      map[item.week] = MONTH_TEXT_ARRAY[month];
      alreadyInMapMonth.add(month);
    }
  });
  return map;
};

const getDailyActivityChartWidth = (height, data) => {
  const firstWeekEndIndex = data.findIndex((item) => item.day === 6);
  const lastWeekEndIndex = findLastIndex(data, (item) => item.day === 6);
  const headIncompleteDays = firstWeekEndIndex + 1;
  const tailIncompleteDays = data.length - lastWeekEndIndex - 1;
  let totalWeeks = (data.length - headIncompleteDays - tailIncompleteDays) / 7;
  if (headIncompleteDays) {
    totalWeeks++;
  }
  if (tailIncompleteDays) {
    totalWeeks++;
  }

  // TODO: 魔法数字，应自适应
  const eachSquareHeight = Math.round((height - 18) / 7);
  return totalWeeks - 1 + totalWeeks * eachSquareHeight;
};

export const generateDailyActivityChart = (params) => {
  const { container, data, height } = params;
  const weekLabelMap = generateWeekLabelMap(data);
  const chart = new Chart({
    container,
    height,
    width: getDailyActivityChartWidth(height, data),
  });
  chart.data(data);
  chart.scale({
    day: {
      type: "cat",
      values: ["Sun.", "Mon.", "Tue.", "Wed.", "Thur.", "Fri.", "Sat."],
    },
    week: {
      type: "cat",
    },
  });
  chart.axis("week", {
    position: "top",
    tickLine: null,
    line: null,
    label: {
      // TODO: 魔法数字，应自适应
      offset: 4,
      formatter: (val) => weekLabelMap[val],
      autoHide: false,
    },
  });
  chart.axis("day", {
    grid: null,
    label: {
      autoHide: false,
    },
  });
  chart.legend(false);
  chart.tooltip({
    showMarkers: false,
    title: (title, datum) => dayjs(datum.date).format("YYYY-MM-DD"),
    customContent: (title, data) => {
      if (!data.length) {
        return;
      }
      const blogCount = data[0]?.data?.blogCount || 0;
      return `<div class="tooltip-wrapper">
        <div>${title}: ${blogCount}</div>
      </div>`;
    },
  });

  chart.polygon().position("week*day").color("blogCount", "#BAE7FF-#1890FF-#0050B3").shape("boundary-polygon");
  chart.interaction("element-active");
  return chart;
};

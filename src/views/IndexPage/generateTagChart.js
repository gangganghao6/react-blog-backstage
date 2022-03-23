import { Chart } from "@antv/g2";

export const generateTagChart = (params) => {
  const { container, data, height } = params;
  const chart = new Chart({
    container,
    height,
    width: height
  });
  chart.data(data);
  chart.legend(false);
  chart.scale({
    name: {
      type: "cat",
    },
  });
  chart.axis("count", false)
  chart.axis("name", {
    line: null,
    grid: null,
    tickLine: null,
  })
  chart.tooltip({
    showMarkers: false,
    customContent: (title, data) => {
      const blogCount = data[0]?.data?.count || 0;
      return `<div class="tooltip-wrapper">
        <div>${title}: ${blogCount}</div>
      </div>`;
    }
  })
  chart.coordinate("polar");
  chart
    .interval()
    .position("name*count")
    .color("name", "#BAE7FF-#1890FF-#0050B3");
  chart.interaction("element-active")
  chart.interaction("tooltip")
  return chart;
};

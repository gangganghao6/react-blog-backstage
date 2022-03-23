import { useEffect, useRef } from "react";
import "./IndexPage.scss";
import { getDailyActivityData } from "./data";
import { generateDailyActivityChart } from "./DailyActivityChart";

const IndexPage = () => {

  const containerRef = useRef();

  useEffect(() => {
    getDailyActivityData().then((data) => {
      generateDailyActivityChart({
        container: containerRef.current,
        data,
        height: 120
      }).render();
    });
  }, []);

  return <>
    <div className="g">
      <h2 className="graph-title">更新日历</h2>
      <div className="daily-activity-chart-container" ref={containerRef} />
    </div>
  </>;

};

export default IndexPage;

import { useEffect, useRef } from "react";
import "./IndexPage.scss";
import { getDailyActivityData, getTagData } from "./data";
import { generateDailyActivityChart } from "./generateDailyActivityChart";
import { generateTagChart } from "./generateTagChart";

const IndexPage = () => {
  const calenderContainer = useRef();
  const tagGraphContainer = useRef();

  useEffect(() => {
    getDailyActivityData().then((data) => {
      generateDailyActivityChart({
        container: calenderContainer.current,
        data,
        height: 120,
      }).render();
    });
    getTagData().then((data) => {
      generateTagChart({
        container: tagGraphContainer.current,
        data,
        height: 160,
      }).render();
    });
  }, []);

  return (
    <>
      <div className="graph-section-row">
        <div className="whole">
          <h2 className="graph-title">更新日历</h2>
          <div className="graph-wrapper" ref={calenderContainer} />
        </div>
      </div>
      <div className="graph-section-row">
        <div className="half">
          <h2 className="graph-title">标签玫瑰图</h2>
          <div className="graph-wrapper" ref={tagGraphContainer} />
        </div>
      </div>
    </>
  );
};

export default IndexPage;

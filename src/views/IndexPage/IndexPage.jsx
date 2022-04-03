import {useEffect, useRef} from 'react';
import './IndexPage.scss';
import {getBrowserData, getDailyActivityData, getOSData, getTagData} from './data';
import {generateDailyActivityChart} from './generateDailyActivityChart';
import {generateTagChart} from './generateTagChart';
import {generateOSChart} from './generateOsChart';
import {generateBrowserChart} from './generateBrowserChart';

const IndexPage = () => {
 const calenderContainer = useRef();
 const tagGraphContainer = useRef();
 const browserGraphContainer = useRef();
 const osGraphContainer = useRef();

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
    width: 250,
   }).render();
  });
  getOSData().then((data) => {
   generateOSChart({
    container: osGraphContainer.current,
    data,
    height: 160,
    width: 250,
   }).render();
  });
  getBrowserData().then((data) => {
   generateBrowserChart({
    container: browserGraphContainer.current,
    data,
    height: 160,
    width: 250,
   }).render();
  });
 }, []);

 return (
     <>
      <div className="graph-section-row">
       <div className="whole">
        <h2 className="graph-title">用户访问热力图</h2>
        <div className="graph-wrapper" ref={calenderContainer}/>
       </div>
      </div>
      <div className="graph-section-row">
       <div className="half">
        <h2 className="graph-title">用户访问设备分布</h2>
        <div className="graph-wrapper" ref={tagGraphContainer}/>
       </div>
       <div className="half">
        <h2 className="graph-title">用户访问系统分布</h2>
        <div className="graph-wrapper" ref={osGraphContainer}/>
       </div>
       <div className="half">
        <h2 className="graph-title">用户访问浏览器布</h2>
        <div className="graph-wrapper" ref={browserGraphContainer}/>
       </div>
      </div>
     </>
 );
};

export default IndexPage;

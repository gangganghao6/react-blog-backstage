import {useEffect, useRef} from 'react';
import './IndexPage.scss';
import {getTotalData} from './data';
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
        getTotalData().then((result) => {
            let {data1, data2, data3, data4} = result.data.data;
            data1 = data1.filter((item) => item !== null)
            generateDailyActivityChart({
                container: calenderContainer.current,
                data: data1,
                height: 120,
            }).render();
            generateTagChart({
                container: tagGraphContainer.current,
                data: data2,
                height: 160,
                width: 250,
            }).render();
            generateOSChart({
                container: osGraphContainer.current,
                data: data3,
                height: 160,
                width: 250,
            }).render();
            generateBrowserChart({
                container: browserGraphContainer.current,
                data: data4,
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
                    <h2 className="graph-title">用户访问浏览器分布</h2>
                    <div className="graph-wrapper" ref={browserGraphContainer}/>
                </div>
            </div>
        </>
    );
};

export default IndexPage;

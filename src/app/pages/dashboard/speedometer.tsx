import React, {FC} from 'react';
import ReactSpeedometer from "react-d3-speedometer"
import { useIntl } from 'react-intl';

const Speedometer: FC = () => {
    const intl = useIntl();
    return(
        <div className="row w-100">
            <div className="col-lg-8 col-xxl-8 col-12">
                <ReactSpeedometer
                    fluidWidth={true}
                    needleHeightRatio={0.7}
                    maxValue={100}
                    value={80}
                    needleTransitionDuration={5000}
                    // needleTransition="easeElastic"
                    needleColor="#000"
                    startColor="#faa267"
                    segments={4}
                    endColor="#e55f04"
                    textColor="grey"
                />
            </div>
            <div className="col-lg-4 col-xxl-4 d-flex flex-lg-column align-items-end">
                <div className="border border-gray-300 border-dashed rounded meter_value">
                    <div className="fw-bold text-gray-800">{intl.formatMessage({id: 'goal'})}</div>
                    <div className="fs-7 text-gray-800 fw-bolder">#58</div>
                </div>
                <div className="border border-gray-300 border-dashed rounded meter_value">
                    <div className="fw-bold text-gray-800">{intl.formatMessage({id: 'achieved'})}</div>
                    <div className="fs-7 text-gray-800 fw-bolder">#46</div>
                </div>
            </div>
        </div>
    )
}
export {Speedometer}
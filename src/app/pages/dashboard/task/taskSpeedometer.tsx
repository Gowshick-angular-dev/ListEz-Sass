import React,{FC} from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { positions } from '@mui/system';
import { right } from '@popperjs/core';
import {useIntl} from 'react-intl';

ChartJS.register(ArcElement, Tooltip, Legend);


const TaskSpeedometer: FC = () => {
    const intl = useIntl();
    return(
        <>
        </>
    )
}
export {TaskSpeedometer}
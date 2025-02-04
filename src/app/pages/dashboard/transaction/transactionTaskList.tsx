import React,{FC} from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { positions } from '@mui/system';
import { right } from '@popperjs/core';

ChartJS.register(ArcElement, Tooltip, Legend);


const TransactionTaskList: FC = () => {
    return(
        <>
        </>
    )
}
export {TransactionTaskList}
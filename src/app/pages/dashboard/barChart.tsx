import React,{FC}  from 'react'

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
    //   text: 'Chart.js Bar Chart',
    },
  },
};

const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July','Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

export const data = {
  labels,
  datasets: [{
    label: 'lead',
    backgroundColor: '#3bb6f1',
    borderColor: 'rgb(255, 99, 132)',
    data: [0, 10, 5, 2, 20, 30, 45, 50, 55, 60],
  }]
};

const DashboardBarChart: FC = () => {
    return(
        <div>
            <Bar options={options} data={data} />
        </div>
    )
}
export{DashboardBarChart}

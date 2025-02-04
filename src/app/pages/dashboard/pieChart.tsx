import React,{FC, useState} from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { positions } from '@mui/system';
import { right } from '@popperjs/core';

ChartJS.register(ArcElement, Tooltip, Legend);  

const DashboardPieChart: FC = () => {

    const [selectedElement, setSelectedElement] = useState<any>(null)
    const data2 = {
        labels: ['Google Ads', 'MagicBricks', 'FaceBook', 'Instagram', 'Newspaper', 'Walk-in'],
        datasets: [
          {
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                '#e27e0c',
                '#ff6700',
                '#208ae6',
                '#03a128',
                '#f37485',
                '#0c4688',
            ],
            borderColor: [
                '#fff',
                '#fff',
                '#fff',
                '#fff',
                '#fff',
                '#fff',
            ],
            borderWidth: 6,
          },
        ],
      };
    
    const handleClick = (event:any, chartElements:any) => {
        if (chartElements && chartElements.length > 0) {
          const clickedElement = chartElements[0];
          setSelectedElement(clickedElement);
          const datasetIndex = clickedElement.datasetIndex;
          const dataIndex = clickedElement.index;
          const clickedLabel = data2.labels[dataIndex];
          const clickedValue = data2.datasets[0].data[dataIndex];
        //   if(clickedLabel == 'Today') {
        //       setSelectedData(Moment().format('YYYY-MM-DD'));
        //   } else if(clickedLabel == 'Yesterday') {
        //       setSelectedData(Moment().subtract(1, 'days').format('YYYY-MM-DD'));
        //   } else if(clickedLabel == 'Yesterday') {
        //       setSelectedData(Moment().subtract(1, 'days').format('YYYY-MM-DD'));
        //   }
    
        console.log("wkehhiwgrjher", clickedLabel, clickedValue);
        
    
        } else {
            alert()
        }
    };
    
    const options2 = {
        onClick: handleClick,
        cutout: selectedElement ? 50 : 0,
        rotation: -0.5 * Math.PI,
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: right,
                labels: {
                    color: '#000',
                    fontSize:'50',
                },
            }
        }
    };

    return(
        // <div>
        <>
        <Doughnut options={options2} data={data2} />
        </>
            // <Doughnut options={options} data={data} />
        // </div>
    )
}
export {DashboardPieChart}
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useEffect, useRef, FC, useState} from 'react'
import ApexCharts, {ApexOptions} from 'apexcharts'
import {KTSVG} from '../../../_metronic/helpers'
import {Dropdown1} from '../../../_metronic/partials/content/dropdown/Dropdown1'
import {getCSS, getCSSVariableValue} from '../../../_metronic/assets/ts/_utils'
import { useAuth } from '../../modules/auth'
import { getAttendanceChart } from './core/requests'
import { useIntl } from 'react-intl'


const AttendanceBar: FC = () => {
  const intl = useIntl();
  const chartRef = useRef<HTMLDivElement | null>(null)

  const {currentUser, logout} = useAuth();
  const userId = currentUser?.id;
  const roleId = currentUser?.designation;
  const usersName = currentUser?.first_name;
  const [attChartData, setAttChartData] = useState<any[]>([]);
  const [present, setPresent] = useState<any[]>([]);
  const [absent, setAbsent] = useState<any[]>([]);
  const [half, setHalf] = useState<any[]>([]);
  const [day, setDay] = useState<any[]>([]);

  const chartData = async () => {
    const response = await getAttendanceChart()
    setAttChartData(response.output?.report)

    let present = [];
    let absent = [];
    let half = [];
    let day = [];

    for(let i=0;i<response.output?.report?.length;i++) {
      present.push(response.output?.report[i]?.present_count)
      absent.push(response.output?.report[i]?.absent_count)
      half.push(response.output?.report[i]?.half_count)
      day.push(response.output?.report[i]?.day_name)
    }
    setPresent(present);
    setAbsent(absent);
    setHalf(half);
    setDay(day);
    console.log('present', present)
    console.log('absent', absent)
    console.log('half', half)
    console.log('day', day)
  }

  function getChartOptions(height: number): ApexOptions {
    const labelColor = getCSSVariableValue('--bs-gray-500')
    const borderColor = getCSSVariableValue('--bs-gray-200')
    const baseColor = getCSSVariableValue('--bs-primary')
    const secondaryColor = getCSSVariableValue('--bs-warning')
    const thirdColor = getCSSVariableValue('--bs-danger')
  
    return {
      series: [
        {
          name: 'Present',
          data: present,
        },
        {
          name: 'Absent',
          data: absent,
        },
        {
          name: 'Half Day',
          data: half,
        },
      ],
      chart: {
        fontFamily: 'inherit',
        type: 'bar',
        height: height,
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '30%',
          borderRadius: 5,
        },
      },
      legend: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent'],
      },
      xaxis: {
        categories: day,
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          style: {
            colors: labelColor,
            fontSize: '12px',
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: labelColor,
            fontSize: '12px',
          },
        },
      },
      fill: {
        opacity: 1,
      },
      states: {
        normal: {
          filter: {
            type: 'none',
            value: 0,
          },
        },
        hover: {
          filter: {
            type: 'none',
            value: 0,
          },
        },
        active: {
          allowMultipleDataPointsSelection: false,
          filter: {
            type: 'none',
            value: 0,
          },
        },
      },
      tooltip: {
        style: {
          fontSize: '12px',
        },
        y: {
          formatter: function (val) {
            return val + ''
          },
        },
      },
      colors: [baseColor, thirdColor, secondaryColor],
      grid: {
        borderColor: borderColor,
        strokeDashArray: 4,
        yaxis: {
          lines: {
            show: true,
          },
        },
      },
    }
  }

  useEffect(() => {
    chartData();
  }, [])

  useEffect(() => {
    if (!chartRef.current) {
      return
    }

    const height = parseInt(getCSS(chartRef.current, 'height'))

    const chart = new ApexCharts(chartRef.current, getChartOptions(height))
    if (chart) {
      chart.render()
    }

    return () => {
      if (chart) {
        chart.destroy()
      }
    }
  }, [day])

  return (
    <div className="card mx-sm-1 mx-xl-2 bs_1 br_15 bar_chart h-100">
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bolder fs-3 mb-1'>{intl.formatMessage({id: 'attendance_status'})}</span>
        </h3>
      </div>
      <div className='card-body px-1 py-2'>
        <div ref={chartRef} id='kt_charts_widget_1_chart' style={{height: '300px'}} />
      </div>
      <div className='card-footer'>
        <div className='symbol symbol-20px w-100 d-flex'>
          <div className='d-flex'>
            <span className='symbol-label bg-primary'></span>
            <p className='p-1 pt-0 m-0'>{intl.formatMessage({id: 'present'})}</p>
          </div>
          <div className='d-flex'>
            <span className='symbol-label bg-danger'></span>
            <p className='p-1 pt-0 m-0'>{intl.formatMessage({id: 'absent'})}</p>
          </div>
          <div className='d-flex'>
            <span className='symbol-label bg-warning'></span>
            <p className='p-1 pt-0 m-0'>{intl.formatMessage({id: 'half_day'})}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export {AttendanceBar}

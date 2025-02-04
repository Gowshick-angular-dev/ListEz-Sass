import React, { FC, useState, useEffect, useRef } from 'react';
import { toAbsoluteUrl } from '../../../_metronic/helpers'
import { useIntl } from 'react-intl';
import { ThemeBuilder } from '../settings/ThemeBuilder/themeBuilder';
import { getContactSummary, getContactPropertyWise, getContactStatusWise, getContactSourceWise, getContactUsersWise, getLeadSummary, getLeadStatusWise, getLeadSourceWise, getTransactionProWise, getTransactionStatusWise, getTransactionSourceWise, getDropProperty, getSourceEffiency, getProjectSummary, getUserProductivity, getSiteVisit, getSiteVisitScheduleDone, getSiteVisitProWise, getSiteVisitProWiseList, getOrgBS } from './core/_requests';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { usePDF, Margin, Resolution} from 'react-to-pdf';
import { Document, Page, Text, StyleSheet, PDFViewer, BlobProvider } from '@react-pdf/renderer';

const Console: FC = () => {
    const intl = useIntl();
    const [contacts, setContacts] = useState<any[]>([]);
    const [contactSourceWise, setContactSourceWise] = useState<any[]>([]);
    const [contactStatusWise, setContactStatusWise] = useState<any[]>([]);
    const [contactUserWise, setContactUserWise] = useState<any[]>([]);
    const [leadProWiseUS, setLeadProWiseST] = useState<any[]>([]);
    const [leadStatusWiseUS, setLeadStatusWiseST] = useState<any[]>([]);
    const [leadSourceWiseUS, setLeadSourceWiseST] = useState<any[]>([]);
    const [transactionProWiseUS, setTransactionProWiseST] = useState<any[]>([]);
    const [transactionSourceWiseUS, setTransactionSourceWiseST] = useState<any[]>([]);
    const [transactionStatusWiseUS, setTransactionStatusWiseST] = useState<any[]>([]);
    const [dropPropertyUS, setDropPropertyST] = useState<any[]>([]);
    const [siteVisitProWiseUS, setSiteVisitProWiseST] = useState<any[]>([]);
    const [siteVisitSDWiseUS, setSiteVisitSDWiseST] = useState<any[]>([]);

    const [businessSettings, setBusinessSettings] = useState<any>({});

    const [contactCount, setContactCount] = useState<any[]>([]);
    const [PWDataT, setPWDataT] = useState<any[]>([]);
    const [PWDataT2, setPWData] = useState<any[]>([]);
    const [sourceEffi, setSourceEffi] = useState<any[]>([]);
    const [projectWise, setProjectWise] = useState<any[]>([]);
    const [userPro, setUserPro] = useState<any[]>([]);
    const [siteVisitProjectWise, setSiteVisitProjectWise] = useState<any[]>([]);
    const [siteVisitProjectWiseList, setSiteVisitProjectWiseList] = useState<any[]>([]);
    const [contactProWise, setContactProWise] = useState<any[]>([]);
    const [createdDate, setCreatedDate] = useState<any>('');
    const [start_date, setStartDate] = useState<any>('');
    const [end_date, setEndDate] = useState<any>('');
    const [convertedS, setConvertedS] = useState<any>([]);
    const [convertedS1, setConvertedS1] = useState<any>([]);
    const [showDiv, setShowDiv] = useState(false);

    console.log('projectWiseprojectWise', projectWise); 
    console.log('siteVisitProjectWise', siteVisitProjectWise); 
    console.log('contacts-datatata', contacts);
    console.log('sourceEffi-datatata', sourceEffi);

    Chart.register(ChartDataLabels);
    const chartRef = useRef<any>(null);
    const chartRef2 = useRef<any>(null);
    const chartRef3 = useRef<any>(null);
    const chartRef4 = useRef<any>(null);

    const chartRef5 = useRef<any>(null);
    const chartRef6 = useRef<any>(null);
    const chartRef7 = useRef<any>(null);

    const chartRef8 = useRef<any>(null);
    const chartRef9 = useRef<any>(null);
    const chartRef10 = useRef<any>(null);

    const chartRef11 = useRef<any>(null);

    const chartRef12 = useRef<any>(null);
    const chartRef13 = useRef<any>(null);

    const chartInstance = useRef<Chart | null>(null);
    const chartInstance2 = useRef<Chart | null>(null);
    const chartInstance3 = useRef<Chart | any>(null);
    const chartInstance4 = useRef<Chart | null>(null);

    const chartInstance5 = useRef<Chart | null>(null);
    const chartInstance6 = useRef<Chart | any>(null);
    const chartInstance7 = useRef<Chart | null>(null);

    const chartInstance8 = useRef<Chart | null>(null);
    const chartInstance9 = useRef<Chart | any>(null);
    const chartInstance10 = useRef<Chart | null>(null);

    const chartInstance11 = useRef<Chart | any>(null);

    const chartInstance12 = useRef<Chart | null>(null);
    const chartInstance13 = useRef<Chart | null>(null);

    const getBusinessSetting = async () => {
        const responseTheme = await getOrgBS();
        setBusinessSettings(responseTheme.output);
        console.log('responseTheme', responseTheme);
    }
    
    console.log('businessSettingsbusinessSettings', businessSettings);

    // const contactSum = async () => {
    //     const response = await getContactPropertyWise({ "start_date": start_date, "end_date": end_date });
    //     console.log('response', response);
    //     console.log('contacts-inside', contacts);
    //     setContacts(response?.output);

    //     const PWData = response?.output.map((item: any) => item.property_name)
    //     const PWData1 = response?.output.map((item: any) => item.count)
    //     const PWTotalCount = response?.output[0].totalCount

    //     const convertedString = PWData.join(', ');
    //     const convertedString1 = PWData1.join(', ');

    //     const ctx = chartRef.current?.getContext('2d');
    //     if (ctx && convertedString && convertedString1) {
    //         console.log('second-time1', PWData1);

    //         new Chart(ctx, {
    //             type: 'bar',
    //             data: {
    //                 labels: PWData,
    //                 datasets: [{
    //                     label: "Project Wise Leads assigned",
    //                     backgroundColor: '#31e862',
    //                     data: PWData1,
    //                     borderColor: 'rgb(76, 8, 135)',
    //                 }]
    //             },
    //             options: {
    //                 scales: {
    //                     y: {
    //                         beginAtZero: true
    //                     }
    //                 },
    //                 plugins: {
    //                     datalabels: {
    //                         anchor: 'end',
    //                         align: 'end',
    //                         color: 'black',
    //                         font: {
    //                             weight: 'bold',
    //                         },
    //                         formatter: function (value, context) {
    //                             return value;
    //                         }
    //                     }
    //                 }
    //             }
    //         });
    //     }
    // }

    const contactSum = async () => {
        try {
            const response = await getContactPropertyWise({ "start_date": start_date, "end_date": end_date });
            console.log('response', response);
            setContacts(response?.output);

            const PWData = response?.output.map((item: any) => item.property_name)
            const PWData1 = response?.output.map((item: any) => item.count)

            if (chartInstance.current) {
                // Update existing chart instance with new data
                chartInstance.current.data.labels = PWData;
                chartInstance.current.data.datasets[0].data = PWData1;
                chartInstance.current.update();
            } 
            else {
                // Create new chart instance
                const ctx = chartRef.current?.getContext('2d');
                if (ctx) {
                    chartInstance.current = new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: PWData,
                            datasets: [{
                                label: "Project Wise Leads assigned",
                                backgroundColor: '#31e862',
                                data: PWData1,
                                borderColor: 'rgb(76, 8, 135)',
                            }]
                        },
                        options: {
                            scales: {
                                y: {
                                    beginAtZero: true
                                }
                            },
                            plugins: {
                                datalabels: {
                                    anchor: 'end',
                                    align: 'top',
                                    color: 'black',
                                    font: {
                                        weight: 'bold',
                                    },
                                    formatter: function (value, context) {
                                        return value;
                                    }
                                }
                            }
                        }
                    });
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    // Contact Summary
    const contactSummary = async () => {
        const responseSummary = await getContactSummary({ "start_date": start_date, "end_date": end_date });
        console.log('responseSummary', responseSummary);
        setContactCount(responseSummary?.output);
    }
    const statusWise = async () => {

        const response2 = await getContactStatusWise({ "start_date": start_date, "end_date": end_date });
        console.log('response', response2);
        setContactStatusWise(response2?.output);

        console.log('response2', response2)

        const mainResponse = response2?.output
        const chartContactPercentage2 = mainResponse.map((item: any) => { return item.count_percentage });

        const STWData = response2?.output.map((item: any) => item.contact_status_name)
        const STWData1 = response2?.output.map((item: any) => item.count)
        const PWTotalCount = response2?.output[0].totalCount

        const properyWiseString = STWData.join(', ');
        const properyWiseString1 = STWData1.join(', ');

        console.log('STWData', STWData)
        console.log('STWData1', STWData1)
        console.log('chartContactPercentage2', chartContactPercentage2)

        if (chartInstance3.current) {
            // Update existing chart instance with new data
            chartInstance3.current.data.labels = STWData.map((value: any, index: any) => `${value}: ${STWData1[index]}`);
            chartInstance3.current.data.datasets[0].data = chartContactPercentage2;
            chartInstance3.current.update();
        } 
        else {

            const ctx2 = chartRef2.current?.getContext('2d');
            if (ctx2 && properyWiseString && properyWiseString1) {
                chartInstance3.current = new Chart(ctx2, {
                    type: 'doughnut',
                    data: {
                        labels: STWData.map((value: any, index: any) => `${value}: ${STWData1[index]}`),
                        datasets: [{
                            label: 'Leads Status Summary',
                            data: chartContactPercentage2,
                            backgroundColor: [
                                'rgb(255, 99, 132)',
                                'rgb(54, 162, 235)',
                                'rgb(255, 206, 86)',
                                'rgb(75, 192, 192)',
                                'rgb(153, 102, 25)',
                                'rgb(255, 159, 64)'
                            ],
                            borderColor: 'rgb(75, 192, 192)',
                        }]
                    },
                    options: {
                        plugins: {
                            // title: {
                            //     display: true,
                            //     text: 'Leads Status Summary',
                            //   },
                            datalabels: {
                                anchor: 'end',
                                align: 'start',
                                color: 'black',
                                font: {
                                    weight: 'bold',
                                },  
                                formatter: function (value, context) {
                                    return value;
                                }
                            }
                        }
                    }
                });
            }
        }
    }
    const sourceWise = async () => {
        try {

            const response3 = await getContactSourceWise({ "start_date": start_date, "end_date": end_date });
            console.log('response3', response3);
            setContactSourceWise(response3?.output);

            console.log('response3', response3)

            const SWData = response3?.output.map((item: any) => item.contact_source_name)
            const SWData1 = response3?.output.map((item: any) => item.count)

            const sourceWiseString = SWData.join(', ');
            const sourceWiseString1 = SWData1.join(', ');

            if (chartInstance2.current) {
                chartInstance2.current.data.labels = SWData;
                chartInstance2.current.data.datasets[0].data = SWData1;
                chartInstance2.current.update();
            }
            else {

                const ctx3 = chartRef3.current?.getContext('2d');
                if (ctx3 && sourceWiseString && sourceWiseString1) {
                    chartInstance2.current = new Chart(ctx3, {
                        type: 'bar',
                        data: {
                            labels: SWData,
                            datasets: [{
                                label: 'Source Wise Lead Generated',
                                data: SWData1,
                                backgroundColor: '#62f5e6',
                                borderColor: 'rgb(75, 192, 192)',
                            }]
                        },
                        options: {
                            scales: {
                                y: {
                                    beginAtZero: true
                                }
                            },
                            plugins: {
                                datalabels: {
                                    anchor: 'end',
                                    align: 'top',
                                    color: 'black',
                                    font: {
                                        weight: 'bold',
                                    },
                                    formatter: function (value, context) {
                                        return value;
                                    }
                                }
                            }
                        }
                    });
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    const usersWise = async () => {

        const responseUserWise = await getContactUsersWise({ "start_date": start_date, "end_date": end_date });
        console.log('responseUserWise', responseUserWise);
        setContactUserWise(responseUserWise?.output);

        console.log('responseUserWise', responseUserWise)

        const UWData = responseUserWise?.output.map((item: any) => item.assign_to_name)
        const UWData1 = responseUserWise?.output.map((item: any) => item.count)

        const usersWiseString = UWData.join(', ');
        const usersWiseString1 = UWData1.join(', ');

        if (chartInstance4.current) {
            // Update existing chart instance with new data
            chartInstance4.current.data.labels = UWData;
            chartInstance4.current.data.datasets[0].data = UWData1;
            chartInstance4.current.update();
        } 
        else {

            const ctx4 = chartRef4.current?.getContext('2d');
            if (ctx4 && usersWiseString && usersWiseString1) {
                chartInstance4.current = new Chart(ctx4, {
                    type: 'bar',
                    data: {
                        labels: UWData,
                        datasets: [{
                            label: 'Employee Wise Lead Generated',
                            data: UWData1,
                            backgroundColor: '#fcc658',
                            borderColor: 'rgb(75, 192, 192)',
                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        },
                        plugins: {
                            datalabels: {
                                anchor: 'end',
                                align: 'top',
                                color: 'black',
                                font: {
                                    weight: 'bold',
                                },
                                formatter: function (value, context) {
                                    return value;
                                }
                            }
                        }
                    }
                });
            }
        }
    }

    // Prospect Summary
    const leadProWise = async () => {

        const responseLeadSummary = await getLeadSummary({ "start_date": start_date, "end_date": end_date });
        console.log('responseLeadSummary', responseLeadSummary);
        setLeadProWiseST(responseLeadSummary?.output);

        console.log('responseLeadSummary', responseLeadSummary)

        const LSProData = responseLeadSummary?.output.map((item: any) => item.property_name)
        const LSProData1 = responseLeadSummary?.output.map((item: any) => item.count)

        const leadProWiseString = LSProData.join(', ');
        const leadProWiseString1 = LSProData1.join(', ');

        console.log('LSProData', LSProData)
        console.log('LSProData1', LSProData1)

        if (chartInstance5.current) {
            // Update existing chart instance with new data
            chartInstance5.current.data.labels = LSProData;
            chartInstance5.current.data.datasets[0].data = LSProData1;
            chartInstance5.current.update();
        } 
        else {

        const ctx5 = chartRef5.current?.getContext('2d');
        if (ctx5 && leadProWiseString && leadProWiseString1) {
            new Chart(ctx5, {
                type: 'bar',
                data: {
                    labels: LSProData,
                    datasets: [{
                        label: 'Prospect Project Wise',
                        data: LSProData1,
                        backgroundColor: '#62f5e6',
                        borderColor: 'rgb(75, 192, 192)',
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    },
                    plugins: {
                        datalabels: {
                            anchor: 'end',
                            align: 'top',
                            color: 'black',
                            font: {
                                weight: 'bold',
                            },
                            formatter: function (value, context) {
                                return value;
                            }
                        }
                    }
                }
            });
        }
    }
    }
    const leadStatusWise = async () => {

        const responseLeadStatus = await getLeadStatusWise({ "start_date": start_date, "end_date": end_date });
        console.log('responseLeadStatus', responseLeadStatus);
        setLeadStatusWiseST(responseLeadStatus?.output);

        console.log('responseLeadStatus', responseLeadStatus)

        const mainResponse = responseLeadStatus?.output
        const chartContactPercentage2 = mainResponse.map((item: any) => { return item.count_percentage });

        const LSTWData = responseLeadStatus?.output.map((item: any) => item.lead_status_name)
        const LSTWData1 = responseLeadStatus?.output.map((item: any) => item.count)

        const leadStatusWiseString = LSTWData.join(', ');
        const leadStatusWiseString1 = LSTWData1.join(', ');

        console.log('LSTWData', LSTWData)
        console.log('LSTWData1', LSTWData1)

        if (chartInstance6.current) {
            // Update existing chart instance with new data
            chartInstance6.current.data.labels = LSTWData.map((value: any, index: any) => `${value}: ${LSTWData1[index]}`);
            chartInstance6.current.data.datasets[0].data = chartContactPercentage2;
            chartInstance6.current.update();
        } 
        else {

        const ctx6 = chartRef6.current?.getContext('2d');
        if (ctx6 && leadStatusWiseString && leadStatusWiseString1) {
            chartInstance6.current = new Chart(ctx6, {
                type: 'doughnut',
                data: {
                    labels: LSTWData.map((value: any, index: any) => `${value}: ${LSTWData1[index]}`),
                    datasets: [{
                        label: 'Prospect Status Wise',
                        data: chartContactPercentage2,
                        backgroundColor: [
                            'rgb(255, 99, 132)',
                            'rgb(54, 162, 235)',
                            'rgb(255, 206, 86)',
                            'rgb(75, 192, 192)',
                            'rgb(153, 102, 25)',
                            'rgb(255, 159, 64)'
                        ],
                        borderColor: 'rgb(75, 192, 192)',
                    }]
                },
                options: {
                    plugins: {
                        // title: {
                        //     display: true,
                        //     text: 'Prospect Status Wise',
                        //   },
                        datalabels: {
                            anchor: 'end',
                            align: 'start',
                            color: 'black',
                            font: {
                                weight: 'bold',
                            },
                            formatter: function (value, context) {
                                return value;
                            }
                        }
                    }
                }
            });
        }
    }
    }
    const leadSourceWise = async () => {

        const responseLeadSW = await getLeadSourceWise({ "start_date": start_date, "end_date": end_date });
        console.log('responseLeadSW', responseLeadSW);
        setLeadSourceWiseST(responseLeadSW?.output);

        console.log('responseLeadSW', responseLeadSW)

        const LSWData = responseLeadSW?.output.map((item: any) => item.lead_source_name)
        const LSWData1 = responseLeadSW?.output.map((item: any) => item.count)

        const leadProWiseString = LSWData.join(', ');
        const leadProWiseString1 = LSWData1.join(', ');

        if (chartInstance7.current) {
            // Update existing chart instance with new data
            chartInstance7.current.data.labels = LSWData;
            chartInstance7.current.data.datasets[0].data = LSWData1;
            chartInstance7.current.update();
        } 
        else {

        const ctx7 = chartRef7.current?.getContext('2d');
        if (ctx7 && leadProWiseString && leadProWiseString1) {
            new Chart(ctx7, {
                type: 'bar',
                data: {
                    labels: LSWData,
                    datasets: [{
                        label: 'Prospect Source Wise',
                        data: LSWData1,
                        backgroundColor: '#fcc658',
                        borderColor: 'rgb(75, 192, 192)',
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    },
                    plugins: {
                        datalabels: {
                            anchor: 'end',
                            align: 'top',
                            color: 'black',
                            font: {
                                weight: 'bold',
                            },
                            formatter: function (value, context) {
                                return value;
                            }
                        }
                    }
                }
            });
        }
    }
    }

    // Transaction Summary
    const transactionProWise = async () => {

        const responseTransactionProW = await getTransactionProWise({ "start_date": start_date, "end_date": end_date });
        console.log('responseTransactionProW', responseTransactionProW);
        setTransactionProWiseST(responseTransactionProW?.output);

        console.log('responseTransactionProW', responseTransactionProW)

        const TransProData = responseTransactionProW?.output.map((item: any) => item.property_name)
        const TransProData1 = responseTransactionProW?.output.map((item: any) => item.count)

        const transProWiseString = TransProData.join(', ');
        const transProWiseString1 = TransProData1.join(', ');

        if (chartInstance8.current) {
            // Update existing chart instance with new data
            chartInstance8.current.data.labels = TransProData;
            chartInstance8.current.data.datasets[0].data = TransProData1;
            chartInstance8.current.update();
        } 
        else {

        const ctx8 = chartRef8.current?.getContext('2d');
        if (ctx8 && transProWiseString && transProWiseString1) {
            chartInstance8.current = new Chart(ctx8, {
                type: 'bar',
                data: {
                    labels: TransProData,
                    datasets: [{
                        label: 'Transaction Project Wise',
                        data: TransProData1,
                        backgroundColor: '#6ad9f7',
                        borderColor: 'rgb(75, 192, 192)',
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    },
                    plugins: {
                        datalabels: {
                            anchor: 'end',
                            align: 'top',
                            color: 'black',
                            font: {
                                weight: 'bold',
                            },
                            formatter: function (value, context) {
                                return value;
                            }
                        }
                    }
                }
            });
        }
    }
    };
    const transactionStatusWise = async () => {

        const responseTransactionStatusW = await getTransactionStatusWise({ "start_date": start_date, "end_date": end_date });
        console.log('responseTransactionStatusW', responseTransactionStatusW);
        setTransactionStatusWiseST(responseTransactionStatusW?.output);

        console.log('responseTransactionStatusW', responseTransactionStatusW)

        const mainResponse = responseTransactionStatusW?.output
        const chartContactPercentage2 = mainResponse.map((item: any) => { return item.count_percentage });

        const TransStatusData = responseTransactionStatusW?.output.map((item: any) => item.transaction_status_name)
        const TransStatusData1 = responseTransactionStatusW?.output.map((item: any) => item.count)

        const transStatusWiseString = TransStatusData.join(', ');
        const transStatusWiseString1 = TransStatusData1.join(', ');

        if (chartInstance9.current) {
            // Update existing chart instance with new data
            chartInstance9.current.data.labels = TransStatusData.map((value: any, index: any) => `${value}: ${TransStatusData1[index]}`);
            chartInstance9.current.data.datasets[0].data = chartContactPercentage2;
            chartInstance9.current.update();
        } 
        else {

        const ctx9 = chartRef9.current?.getContext('2d');
        if (ctx9 && transStatusWiseString && transStatusWiseString1) {
            chartInstance9.current = new Chart(ctx9, {
                type: 'doughnut',
                data: {
                    labels: TransStatusData.map((value: any, index: any) => `${value}: ${TransStatusData1[index]}`),
                    datasets: [{
                        label: 'Transaction Status Wise',
                        data: chartContactPercentage2,
                        backgroundColor: [
                            'rgb(255, 99, 132)',
                            'rgb(54, 162, 235)',
                            'rgb(255, 206, 86)',
                            'rgb(75, 192, 192)',
                            'rgb(153, 102, 25)',
                            'rgb(255, 159, 64)'
                        ],
                        borderColor: 'rgb(75, 192, 192)',
                    }]
                },
                options: {
                    plugins: {
                        // title: {
                        //     display: true,
                        //     text: 'Transaction Status Wise',
                        //   },
                        datalabels: {
                            anchor: 'end',
                            align: 'start',
                            color: 'black',
                            font: {
                                weight: 'bold',
                            },
                            formatter: function (value, context) {
                                return value;
                            }
                        }
                    }
                }
            });
        }
    }
    };
    const transactionSourceWise = async () => {

        const responseTransactionSourceW = await getTransactionSourceWise({ "start_date": start_date, "end_date": end_date });
        console.log('responseTransactionSourceW', responseTransactionSourceW);
        setTransactionSourceWiseST(responseTransactionSourceW?.output);

        console.log('responseTransactionSourceW', responseTransactionSourceW)

        const TransSourceData = responseTransactionSourceW?.output.map((item: any) => item.transaction_source_name)
        const TransSourceData1 = responseTransactionSourceW?.output.map((item: any) => item.count)

        const transSourceWiseString = TransSourceData.join(', ');
        const transSourceWiseString1 = TransSourceData1.join(', ');

        if (chartInstance10.current) {
            // Update existing chart instance with new data
            chartInstance10.current.data.labels = TransSourceData;
            chartInstance10.current.data.datasets[0].data = TransSourceData1;
            chartInstance10.current.update();
        } 
        else {

        const ctx10 = chartRef10.current?.getContext('2d');
        if (ctx10 && transSourceWiseString && transSourceWiseString1) {
            chartInstance10.current = new Chart(ctx10, {
                type: 'bar',
                data: {
                    labels: TransSourceData,
                    datasets: [{
                        label: 'Transaction Source Wise',
                        data: TransSourceData1,
                        backgroundColor: '#fcc658',
                        borderColor: 'rgb(75, 192, 192)',
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    },
                    plugins: {
                        datalabels: {
                            anchor: 'end',
                            align: 'top',
                            color: 'black',
                            font: {
                                weight: 'bold',
                            },
                            formatter: function (value, context) {
                                return value;
                            }
                        }
                    }
                }
            });
        }
    }
    };

    // Drop Summary
    const dropProWise = async () => {

        const responseDropSummary = await getDropProperty({ "start_date": start_date, "end_date": end_date });
        console.log('responseDropSummary', responseDropSummary);
        setDropPropertyST(responseDropSummary?.output);

        console.log('responseDropSummary', responseDropSummary)

        const mainResponse = responseDropSummary?.output
        const chartContactPercentage2 = mainResponse.map((item: any) => { return item.count_percentage });

        const dropPro = responseDropSummary?.output.map((item: any) => item.property_name)
        const dropPro1 = responseDropSummary?.output.map((item: any) => item.count)

        const dropProWiseString = dropPro.join(', ');
        const dropProWiseString1 = dropPro1.join(', ');

        if (chartInstance11.current) {
            // Update existing chart instance with new data
            chartInstance11.current.data.labels = dropPro.map((value: any, index: any) => `${value}: ${dropPro1[index]}`);
            chartInstance11.current.data.datasets[0].data = chartContactPercentage2;
            chartInstance11.current.update();
        } 
        else {

        const ctx11 = chartRef11.current?.getContext('2d');
        if (ctx11 && dropProWiseString && dropProWiseString1) {
            chartInstance11.current = new Chart(ctx11, {
                type: 'doughnut',
                data: {
                    labels: dropPro.map((value: any, index: any) => `${value}: ${dropPro1[index]}`),
                    datasets: [{
                        label: 'Drop Property Wise - Total Count' +  `${dropPropertyUS[0]?.totalCount}`,
                        data: chartContactPercentage2,
                        backgroundColor: [
                            'rgb(255, 99, 132)',
                            'rgb(54, 162, 235)',
                            'rgb(255, 206, 86)',
                            'rgb(75, 192, 192)',
                            'rgb(153, 102, 25)',
                            'rgb(255, 159, 64)'
                        ],
                        borderColor: 'rgb(75, 192, 192)',
                    }]
                },
                options: {
                    plugins: {
                        // title: {
                        //     display: true,
                        //     text: 'Drop Property Wise',
                        //   },
                        datalabels: {
                            anchor: 'end',
                            align: 'start',
                            color: 'black',
                            font: {
                                weight: 'bold',
                            },
                            formatter: function (value, context) {
                                return value;
                            }
                        }
                    }
                }
            });
        }
    }
    };
    const sourceEffiency = async () => {
        const responseSE = await getSourceEffiency({ "start_date": start_date, "end_date": end_date });
        console.log('responseSE', responseSE);
        setSourceEffi(responseSE?.output);
    };
    const projectWiseSummary = async () => {
        const responsePS = await getProjectSummary({ "start_date": start_date, "end_date": end_date });
        console.log('responsePS', responsePS);
        setProjectWise(responsePS?.output);
    };
    const userProductivity = async () => {
        const responseUP = await getUserProductivity({ "start_date": start_date, "end_date": end_date });
        console.log('responseUP', responseUP);
        setUserPro(responseUP?.output);
    };

    // Site Visit
    const SiteVist = async () => {

        const responseSV = await getSiteVisit({ "start_date": start_date, "end_date": end_date });
        console.log('responseSV', responseSV);
        setSiteVisitProWiseST(responseSV?.output);

        console.log('responseSV', responseSV)

        const SVData = responseSV?.output.map((item: any) => item.property_name)
        const SVData1 = responseSV?.output.map((item: any) => item.count)

        const SVWiseString = SVData.join(', ');
        const SVWiseString1 = SVData1.join(', ');

        if (chartInstance12.current) {
            // Update existing chart instance with new data
            chartInstance12.current.data.labels = SVData;
            chartInstance12.current.data.datasets[0].data = SVData1;
            chartInstance12.current.update();
        } 
        else {

        const ctx12 = chartRef12.current?.getContext('2d');
        if (ctx12 && SVWiseString && SVWiseString1) {
            chartInstance12.current = new Chart(ctx12, {
                type: 'bar',
                data: {
                    labels: SVData,
                    datasets: [{
                        label: 'Site Visit - Project Wise',
                        data: SVData1,
                        backgroundColor: '#6ad9f7',
                        borderColor: 'rgb(75, 192, 192)',
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    },
                    plugins: {
                        datalabels: {
                            anchor: 'end',
                            align: 'start',
                            color: 'black',
                            font: {
                                weight: 'bold',
                            },
                            formatter: function (value, context) {
                                return value;
                            }
                        }
                    }
                }
            });
        }
    }
    };
    const SiteVistSchedule = async () => {

        const responseSVSD = await getSiteVisitScheduleDone({ "start_date": start_date, "end_date": end_date });
        console.log('responseSVSD', responseSVSD);
        setSiteVisitSDWiseST(responseSVSD?.output);

        console.log('responseSVSD', responseSVSD)

        const SVSData = responseSVSD?.output.map((item: any) => item.site_visit_schedule)
        const SVCData = responseSVSD?.output.map((item: any) => item.site_visit_completed)
        const SVNameData = responseSVSD?.output.map((item: any) => item.assign_to_name)

        const SVSWiseString = SVSData.join(', ');
        const SVCWiseString = SVCData.join(', ');

        if (chartInstance13.current) {
            // Update existing chart instance with new data
            chartInstance13.current.data.labels = SVNameData;
            chartInstance13.current.data.datasets[0].data = SVSData;
            chartInstance13.current.data.datasets[1].data = SVCData;
            chartInstance13.current.update();
        } 
        
        else {
        const ctx13 = chartRef13.current?.getContext('2d');
        if (ctx13 && SVSWiseString && SVCWiseString) {
            chartInstance13.current = new Chart(ctx13, {
                type: 'bar',
                data: {
                    labels: SVNameData,
                    datasets: [
                        {
                            label: `Site Visit Schedule`,
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            borderColor: 'rgba(255, 99, 132, 1)',
                            borderWidth: 1,
                            data: SVSData,
                        },
                        {
                            label: `Site Visit Done`,
                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1,
                            data: SVCData
                        },
                    ]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    },
                    plugins: {
                        datalabels: {
                            anchor: 'end',
                            align: 'start',
                            color: 'black',
                            font: {
                                weight: 'bold',
                            },
                            formatter: function (value, context) {
                                return value;
                            }
                        }
                    }
                }
            });
        }
    }
    };
    const siteVisitPW = async () => {
        const responsePW = await getSiteVisitProWise({ "start_date": start_date, "end_date": end_date });
        console.log('responsePW', responsePW);
        setSiteVisitProjectWise(responsePW?.output);
    };
    const siteVisitPWList = async () => {
        const responsePWL = await getSiteVisitProWiseList({ "start_date": start_date, "end_date": end_date });
        console.log('responsePWL', responsePWL);
        setSiteVisitProjectWiseList(responsePWL?.output);
    };


    const HandleStartDate = (e: any) => {
        setStartDate(e.target.value)
        console.log('setStartDate', e.target.value);
    }
    const HandleEndDate = (e: any) => {
        setEndDate(e.target.value)
        console.log('setEndDate', e.target.value);
    }
    // console.log('contacts', contacts);
    console.log('start_date', start_date);
    console.log('end_date', end_date);

    // const chartRef = useRef<any>(null);
    // const chartRef2 = useRef<HTMLCanvasElement>(null);
    // const chartRef3 = useRef<HTMLCanvasElement>(null);
    // const chartRef4 = useRef<HTMLCanvasElement>(null);

    // const chartRef5 = useRef<HTMLCanvasElement>(null);
    // const chartRef6 = useRef<HTMLCanvasElement>(null);
    // const chartRef7 = useRef<HTMLCanvasElement>(null);

    // const chartRef8 = useRef<HTMLCanvasElement>(null);
    // const chartRef9 = useRef<HTMLCanvasElement>(null);
    // const chartRef10 = useRef<HTMLCanvasElement>(null);

    // const chartRef11 = useRef<HTMLCanvasElement>(null);

    // const chartRef12 = useRef<HTMLCanvasElement>(null);
    // const chartRef13 = useRef<HTMLCanvasElement>(null);
    // const chartRef14 = useRef<HTMLCanvasElement>(null);

    let totalContact1 = 0;
    let totalLead1 = 0;
    let totalBooking1 = 0;

    let totalContactU = 0;
    let totalNCU = 0;
    let totalLeadU = 0;
    let totalTraU = 0;
    let totalSVU = 0;
    let totalSVCU = 0;

    let totalSchedule = 0;
    let totalCompleted = 0;
    let totalCancelled = 0;

    let totalSVCA = 0;
    let totalSVCO = 0;
    let totalSVS = 0;
    let totalSVCOUNT = 0;

    let ggg;
    const totalColumnCounts: { [key: string]: number } = {};

    // const renderTableRows = () => {
    //     return siteVisitProjectWise.map((row, index) => {
    //         const {
    //             property_id,
    //             property_name,
    //             site_visit_schedule,
    //             site_visit_completed,
    //             site_visit_cancelled,
    //             ...rest
    //         } = row;

            // Object.keys(rest).forEach((columnName) => {
            //     if (
            //         columnName !== 'property_id' &&
            //         columnName !== 'property_name' &&
            //         columnName !== 'site_visit_schedule' &&
            //         columnName !== 'site_visit_completed' &&
            //         columnName !== 'site_visit_cancelled'
            //     ) {
            //         const value = row[columnName];
            //         const parsedValue = value !== undefined && value !== null && value !== '' ? parseInt(value) : 0;
            //         totalColumnCounts[columnName] = (totalColumnCounts[columnName] || 0) + parsedValue;
            //     }
            // });

    //         totalSchedule += site_visit_schedule || 0;
    //         totalCompleted += site_visit_completed || 0;
    //         totalCancelled += site_visit_cancelled || 0;

    //         console.log('totalSchedule',totalSchedule);
    //         console.log('totalCompleted',totalCompleted);
    //         console.log('totalCancelled',totalCancelled);
            

    //         return (
    //             <tr key={index} style={{ textAlign: 'center' }}>
    //                 <td>{index + 1}</td>
    //                 <td>{property_name}</td>
    //                 <td>{site_visit_schedule}</td>
    //                 <td>{site_visit_completed}</td>
    //                 <td>{site_visit_cancelled}</td>
    //                 {Object.keys(rest).slice(0, 3).map((columnName, columnIndex) => {
    //                     if (
    //                         columnName !== 'property_id' &&
    //                         columnName !== 'property_name' &&
    //                         columnName !== 'site_visit_schedule' &&
    //                         columnName !== 'site_visit_completed' &&
    //                         columnName !== 'site_visit_cancelled'
    //                     ) {
    //                         const value = row[columnName];
    //                         return <td key={columnIndex}>{parseInt(value) || 0}</td>;
    //                     }
    //                     return null;
    //                 })}
    //             </tr>
    //         );
    //     });
    // };


    const renderTableRows = () => {

        return siteVisitProjectWise.map((row, index) => {
            const {
                property_id,
                property_name,
                site_visit_schedule,
                site_visit_completed,
                site_visit_cancelled,
                ...rest
            } = row;

            Object.keys(rest).forEach((columnName) => {
                if (
                    columnName !== 'property_id' &&
                    columnName !== 'property_name' &&
                    columnName !== 'site_visit_schedule' &&
                    columnName !== 'site_visit_completed' &&
                    columnName !== 'site_visit_cancelled'
                ) {
                    const value = row[columnName];
                    const parsedValue = value !== undefined && value !== null && value !== '' ? parseInt(value) : 0;
                    totalColumnCounts[columnName] = (totalColumnCounts[columnName] || 0) + parsedValue;
                }
            });

            totalSchedule += site_visit_schedule || 0;
            totalCompleted += site_visit_completed || 0;
            totalCancelled += site_visit_cancelled || 0;

            console.log('totalSchedule', totalSchedule);
            console.log('totalCompleted', totalCompleted);
            console.log('totalCancelled', totalCancelled);

            return (
                <tr key={index} style={{ textAlign: 'center' }}>
                    <td>{index + 1}</td>
                    <td>{property_name}</td>
                    <td>{site_visit_schedule}</td>
                    <td>{site_visit_completed}</td>
                    <td>{site_visit_cancelled}</td>
                    {Object.keys(rest).slice(0, 3).map((columnName, columnIndex) => {
                        if (
                            columnName !== 'property_id' &&
                            columnName !== 'property_name' &&
                            columnName !== 'site_visit_schedule' &&
                            columnName !== 'site_visit_completed' &&
                            columnName !== 'site_visit_cancelled'
                        ) {
                            const value = row[columnName];
                            return <td key={columnIndex}>{parseInt(value) || 0}</td>;
                        }
                        return null;
                    })}
                </tr>
            );
        });
    };
    renderTableRows()

    // const generatePDF = (element:any, fileName:any) => {
    //     const pdf = new jsPDF();

    //     html2canvas(element).then((canvas) => {
    //       const imgData = canvas.toDataURL('image/png');

    //       const pdfWidth = pdf.internal.pageSize.getWidth();
    //       const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    //       pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    //       pdf.addPage();
    //       pdf.save(fileName);
    //     });
    //   };

    //   const handlePDFDownload = () => {
    //     const element = document.getElementById('pdfContent');
    //     console.log('test data')
    //     generatePDF(element, 'example.pdf');
    //   };
    
    // const { toPDF, targetRef } = usePDF({ 
    //     filename: 'test.pdf',
    // options: {
    //     format: 'a4',
    //     orientation: 'portrait',
    //     unit: 'mm',
    //     compress: true
    //   }});

    const { toPDF, targetRef } = usePDF({
        filename: 'page.pdf', page: {
            margin: Margin.SMALL,
            format:  'A3',
            orientation: "portrait"
        }, canvas: {
            mimeType: 'image/png',
            qualityRatio: 1
        }, overrides: {
            pdf: {
                compress: true
            },
            canvas: {
                useCORS: true
            }
        }
    });  

    // const section1Ref = useRef(null);
    // const section2Ref = useRef(null);
  
    // const { toPDF } = usePDF({ filename: 'test.pdf' });
  
    // const handleGeneratePDF = () => {
    //     const aaa:any = [section1Ref?.current, section2Ref?.current]
    //     toPDF(aaa);
    // };

    useEffect(() => {
    getBusinessSetting();
    }, []);

    const handleChart = () => {
        if(start_date && end_date) {
            contactSum()
            contactSummary()
            statusWise()
            sourceWise()
            usersWise()
            leadProWise()
            leadStatusWise()
            leadSourceWise()
            transactionProWise()
            transactionStatusWise()
            transactionSourceWise()
            dropProWise()
            sourceEffiency()
            projectWiseSummary()
            userProductivity()
            SiteVist()
            SiteVistSchedule()
            siteVisitPW()
            siteVisitPWList()
            setShowDiv(true);
        }
    }
    

    // useEffect(() => {

    // }, [convertedS, convertedS1]);

    return (
        <>
            <div className='d-flex justify-content-center'>
                <p className='pt-5 fs-1 fw-bolder'>{intl.formatMessage({ id: 'reports_console' })}
                </p>
            </div>
            <div className=''>
                <div className='row'>
                    <div className='d-flex justify-content-center'>
                        <div className='col-md-3 w-100 my-4 mx-auto container py-4'>
                            <div className='card w-100 shadow-lg bg-white rounded'>
                                <div className='card-body position-relative'>
                                    <div className="row align-items-center">
                                        <div className="col-md-4 col-12 mb-3">
                                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({ id: 'created_from_date' })}</label>
                                            <div className="input-group mb-3 bs_2 shadow-none">
                                                <input type="date" className="form-control" onChange={HandleStartDate} placeholder="date" />
                                            </div>
                                        </div>
                                        <div className="col-md-4 col-12 mb-3">
                                            <label htmlFor="basic-url" className="form-label">{intl.formatMessage({ id: 'created_end_date' })}</label>
                                            <div className="input-group mb-3 bs_2 shadow-none">
                                                <input type="date" className="form-control" onChange={HandleEndDate} placeholder="date" />
                                            </div>
                                        </div>
                                        <div className="col-md-2 col-12 mb-3 d-flex align-items-center justify-content-center">
                                            <button className='btn mt-6 w-100' style={{'backgroundColor': businessSettings?.primary_color ?? '#ff6700', 'color': businessSettings?.tertiary_color ?? '#ffffff'}} onClick={() => handleChart()}>
                                              Submit
                                            </button>
                                        </div>
                                        <div className="col-md-2 col-12 mb-3 d-flex align-items-center justify-content-center">
                                            <button className='btn mt-6 w-100' style={{'backgroundColor': businessSettings?.primary_color ?? '#ff6700', 'color': businessSettings?.tertiary_color ?? '#ffffff'}} onClick={() => toPDF()}>
                                                Download PDF
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {showDiv ? (
                <div className='' ref={targetRef}>
                    <div>
                        {/* <div className="pt-4 px-0">
                        <div className="row">
                            <div className="col-md-6 p-4 my-4">
                                <h4 className="text-start p-2 mx-4">{start_date == undefined ? 'Start Date' : start_date} - {end_date == undefined ? 'End Date' : end_date}</h4>
                            </div>
                            <div className="col-md-4 p-4 my-4">
                                <div className="text-end">
                                    <img src={`http://localhost:8080/uploads/organization/logo/${contactCount[0]?.org_id}/${contactCount[0]?.org_logo}`} className="w-50" alt="organization logo" />
                                </div>
                            </div>
                        </div>
                    </div> */}
                        {/* Total Count Summary */}
                        <h1 className='p-4 my-4 text-center' style={{'backgroundColor': businessSettings?.primary_color ?? '#ff6700', 'color': businessSettings?.tertiary_color ?? '#ffffff'}}>Total Count Summary</h1>
                        <div className="container pt-4 pb-4">
                            <div className="row p-2 px-0">
                                <div className="col-md-4">
                                    <div className="card bgGrey p-0 shadow-sm bg-white rounded">
                                        <div className="card-body text-center">
                                            <h3 className="card-text"> Total Leads Generated</h3>
                                            <p className="card-text">{contactCount[0]?.contact_count}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="card bgGrey p-0 shadow-sm bg-white rounded">
                                        <div className="card-body text-center">
                                            <h3 className="card-text"> Total Prospects</h3>
                                            <p className="card-text">{contactCount[0]?.lead_count}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="card bgGrey p-0 shadow-sm bg-white rounded">
                                        <div className="card-body text-center">
                                            <h3 className="card-text"> Total Bookings</h3>
                                            <p className="card-text">{contactCount[0]?.transaction_count}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row p-2 px-0">
                                <div className="col-md-6">
                                    <div className="card bgGrey p-0 shadow-sm bg-white rounded">
                                        <div className="card-body text-center">
                                            <h3 className="card-text"> Total Not Contacted leads </h3>
                                            <p className="card-text">{contactCount[0]?.not_contacted_leads}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="card bgGrey p-0 shadow-sm bg-white rounded">
                                        <div className="card-body text-center">
                                            <h3 className="card-text"> Total Site Visits Done </h3>
                                            <p className="card-text">{contactCount[0]?.site_viste_done}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Lead Summary */}
                    <div>
                        <h1 className='p-4 my-4 text-center' style={{'backgroundColor': businessSettings?.primary_color ?? '#ff6700', 'color': businessSettings?.tertiary_color ?? '#ffffff'}}>Lead Summary</h1>
                        <div className='row'>
                            <div className='col-md-3 w-50 my-4' >
                            <h5 className='text-center'>Project Wise - Total Count : {contacts[0]?.totalCount}</h5>
                                <canvas ref={chartRef}></canvas>
                            </div>
                            <div className='col-md-3 w-50 my-4'>
                            <h5 className='text-center'>Source Wise - Total Count : {contactSourceWise[0]?.totalCount}</h5>
                                <canvas ref={chartRef3}></canvas>
                            </div>
                            <div className='col-md-3 w-25 my-4 mx-auto'>
                            <h5 className='text-center'> Lead Status - Total Count: {contactStatusWise[0]?.totalCount}</h5>
                                <canvas ref={chartRef2}></canvas>
                            </div>
                            <div className='col-md-3 w-50 my-4'>
                            <h5 className='text-center'> Employee Wise - Total Count: {contactUserWise[0]?.totalCount}</h5>
                                <canvas ref={chartRef4}></canvas>
                            </div>
                        </div>
                    </div>

                    {/* Prospect Summary */}
                    <div>
                        <h1 className='p-4 my-4 text-center' style={{'backgroundColor': businessSettings?.primary_color ?? '#ff6700', 'color': businessSettings?.tertiary_color ?? '#ffffff'}}>Prospect Summary</h1>
                        <div className='row'>
                            <div className='col-md-3 w-50 my-4'>
                            <h5 className='text-center'> Prospect Project - Total Count: {leadProWiseUS[0]?.totalCount}</h5>
                                <canvas ref={chartRef5}></canvas>
                            </div>
                            <div className='col-md-3 w-50 my-4'>
                            <h5 className='text-center'> Prospect Source - Total Count: {leadSourceWiseUS[0]?.totalCount}</h5>
                                <canvas ref={chartRef7}></canvas>
                            </div>
                            <div className='d-flex justify-content-center'>
                                <div className='col-md-3 w-25 my-4 mx-auto'>
                                <h5 className='text-center'> Prospect Status - Total Count: {leadStatusWiseUS[0]?.totalCount}</h5>
                                    <canvas ref={chartRef6}></canvas>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Transaction Summary */}
                    <div>
                        <h1 className='p-4 my-4 text-center' style={{'backgroundColor': businessSettings?.primary_color ?? '#ff6700', 'color': businessSettings?.tertiary_color ?? '#ffffff'}}>Transaction Summary</h1>
                        <div className='row'>
                            <div className='col-md-3 w-50 my-4'>
                            <h5 className='text-center'> Transaction Project - Total Count: {transactionProWiseUS[0]?.totalCount}</h5>
                                <canvas ref={chartRef8}></canvas>
                            </div>
                            <div className='col-md-3 w-50 my-4'>
                            <h5 className='text-center'> Transaction Source - Total Count: {transactionSourceWiseUS[0]?.totalCount}</h5>
                                <canvas ref={chartRef10}></canvas>
                            </div>
                            <div className='d-flex justify-content-center'>
                                <div className='col-md-3 w-25 my-4 mx-auto'>
                                <h5 className='text-center'> Transaction Status - Total Count: {transactionStatusWiseUS[0]?.totalCount}</h5>
                                    <canvas ref={chartRef9}></canvas>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Drop Summary */}
                    <div>
                        <h1 className='p-4 my-4 text-center' style={{'backgroundColor': businessSettings?.primary_color ?? '#ff6700', 'color': businessSettings?.tertiary_color ?? '#ffffff'}}>Drop Property Summary</h1>
                        <div className='row'>
                            {/* <div className='col-md-3 w-100 h-50 my-4'>
                            <canvas ref={chartRef11}></canvas>
                        </div> */}
                            <div className='d-flex justify-content-center'>
                                <div className='col-md-3 w-25 my-4 mx-auto'>
                                <h5 className='text-center'> Drop Property - Total Count: {dropPropertyUS[0]?.totalCount}</h5>
                                    <canvas ref={chartRef11}></canvas>
                                </div>
                            </div>
                        </div>
                        <h1 className='p-4 my-4 text-center' style={{'backgroundColor': businessSettings?.primary_color ?? '#ff6700', 'color': businessSettings?.tertiary_color ?? '#ffffff'}}>Source Efficiency Report</h1>

                        <div className='row'>
                            <div className="p-4 m-4 text-white">
                                <table className="table bg-secondary">
                                    <thead className='bg-dark text-white'>
                                        <tr style={{ textAlign: 'center' }}>
                                            <th scope="col" className="py-4">S.No</th>
                                            <th scope="col" className="py-4">Source</th>
                                            <th scope="col" className="py-4">Leads Generated</th>
                                            <th scope="col" className="py-4">Prospects Converted</th>
                                            <th scope="col" className="py-4">Bookings</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sourceEffi.map((row, i) => {
                                            const conversionRate = row.lead_converted === 0 ? "0.00" : ((row.booking / row.contact_generated) * 100).toFixed(2);
                                            console.log('conversionRate', conversionRate);
                                            

                                            totalContact1 += parseInt(row.contact_generated);
                                            totalLead1 += parseInt(row.lead_converted);
                                            totalBooking1 += parseInt(row.booking);

                                            console.log('totalContact1', row.contact_generated);
                                            console.log('totalLead1', row.lead_converted);
                                            console.log('totalBooking1', row.booking);


                                            return (
                                                <tr key={row.source_name} style={{ textAlign: 'center' }}>
                                                    <td className="py-4">{i + 1}.</td>
                                                    <td className="py-4">{row.source_name}</td>
                                                    <td className="py-4">{row.contact_generated}</td>
                                                    <td>
                                                        <div>
                                                            {row.lead_converted} <br />
                                                            Conversion from Lead - {(row.lead_converted / row.contact_generated * 100).toFixed(2)} %
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div>
                                                            {row.booking} <br />
                                                            Conversion from Lead - {conversionRate} %
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        <tr className="bg-dark text-white" style={{ textAlign: 'center' }}>
                                            <td></td>
                                            <td className="py-4"><strong>Total</strong></td>
                                            <td className="py-4">{totalContact1}</td>
                                            <td>
                                                <div>
                                                    {totalLead1} <br />
                                                    Conversion from Lead - {(totalLead1 / totalContact1 * 100).toFixed(2)} %
                                                </div>
                                            </td>
                                            <td>
                                                <div>
                                                    {totalBooking1} <br />
                                                    Conversion from Lead - {(totalBooking1 / totalContact1 * 100).toFixed(2)} %
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    {/* Project Wise Summary And User Productivity */}
                    <div>
                        <h1 className='p-4 my-4 text-center' style={{'backgroundColor': businessSettings?.primary_color ?? '#ff6700', 'color': businessSettings?.tertiary_color ?? '#ffffff'}}>Project Wise Summary</h1>
                        <div className="row">
                            <div className="p-4 m-4 text-white">
                                <table className="table bg-secondary">
                                    {projectWise && projectWise.length > 0 && (
                                        <thead className='bg-dark text-white'>
                                            <tr style={{ textAlign: 'center' }}>
                                                <th scope="col">S.no</th>
                                                {Object.keys(projectWise[0])
                                                    .slice(0, 9)
                                                    .map((columnName) => (
                                                        <React.Fragment key={columnName}>
                                                            {columnName !== 'lead_converted' && columnName !== 'site_visit_count' && columnName !== 'property_name' && columnName !== 'contact_count' && columnName !== 'lead_count' && columnName !== 'booking'  && (
                                                                <th scope="col">{columnName}</th>
                                                            )}
                                                            {columnName === 'property_name' && <th scope="col">Property Name</th>}
                                                            {columnName === 'contact_count' && <th scope="col">Contact Count</th>}
                                                            {columnName === 'lead_count' && <th scope="col">Lead Count</th>}
                                                            {columnName === 'lead_converted' && <th scope="col">Lead Converted</th>}
                                                            {columnName === 'site_visit_count' && <th scope="col">Site Visit Count</th>}
                                                            {columnName === 'booking' && <th scope="col">Total Booking</th>}
                                                        </React.Fragment>
                                                    ))}
                                            </tr>
                                        </thead>
                                    )}
                                    <tbody>
                                        {projectWise.map((row, index) => (
                                            <tr key={index} style={{ textAlign: 'center' }}>
                                                <td>{index + 1}.</td>
                                                {Object.keys(projectWise[0])
                                                    .slice(0, 9)
                                                    .map((columnName) => (
                                                        <React.Fragment key={columnName}>
                                                            {columnName !== 'lead_converted' && (
                                                                // <td>{row[columnName] !== undefined && row[columnName] !== null ? row[columnName] : 0}</td>
                                                                <td>{row[columnName] !== undefined && row[columnName] !== null ? row[columnName] : 0}</td>
                                                            )}
                                                            {columnName === 'lead_converted' && (
                                                                <td>
                                                                    <div>
                                                                        {row.booking} <br />
                                                                        {row.booking === 0 ? (
                                                                            'Conversion from Lead - 0.00 %'
                                                                        ) : (
                                                                            <>
                                                                                Conversion from Lead -{' '}
                                                                                {((row.booking / row.lead_converted) * 100).toFixed(2)} %
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                            )}
                                                        </React.Fragment>
                                                    ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <h1 className='p-4 my-4 text-center' style={{'backgroundColor': businessSettings?.primary_color ?? '#ff6700', 'color': businessSettings?.tertiary_color ?? '#ffffff'}}>User Productivity</h1>
                        <div className='row'>
                            <div className="p-4 m-4 text-white bgGrey">
                                <table className="table bg-secondary">
                                    <thead className="bg-dark text-white">
                                        <tr style={{ textAlign: 'center' }}>
                                            <th scope="col">S.No</th>
                                            <th scope="col">User Name</th>
                                            <th scope="col">Total Leads Assigned</th>
                                            <th scope="col">Not Contacted</th>
                                            <th scope="col">Total Prospects</th>
                                            <th scope="col">Booking</th>
                                            <th scope="col">Site Visit Scheduled</th>
                                            <th scope="col">Site Visit Completed</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {userPro.map((row, i) => {
                                            totalContactU += row.no_of_contacts;
                                            totalNCU += row.not_contacted_leads;
                                            totalLeadU += row.no_of_leads;
                                            totalTraU += row.no_of_transactions;
                                            totalSVU += row.no_of_site_visit;
                                            totalSVCU += row.no_of_site_visit_completed;

                                            return (
                                                <tr style={{ textAlign: 'center' }}>
                                                    <td>{i + 1}.</td>
                                                    <td>{row.user_name}</td>
                                                    <td>{row.no_of_contacts}</td>
                                                    <td>{row.not_contacted_leads}</td>
                                                    <td>{row.no_of_leads}</td>
                                                    <td>{row.no_of_transactions}</td>
                                                    <td>{row.no_of_site_visit}</td>
                                                    <td>{row.no_of_site_visit_completed}</td>
                                                </tr>
                                            );
                                        })}
                                        <tr className="bg-dark text-white" style={{ textAlign: 'center' }}>
                                            <td></td>
                                            <td>
                                                <strong>Total</strong>
                                            </td>
                                            <td>{totalContactU}</td>
                                            <td>{totalNCU}</td>
                                            <td>{totalLeadU}</td>
                                            <td>{totalTraU}</td>
                                            <td>{totalSVU}</td>
                                            <td>{totalSVCU}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    {/* Site Visit */}
                    <div>
                        <h1 className='p-4 my-4 text-center' style={{'backgroundColor': businessSettings?.primary_color ?? '#ff6700', 'color': businessSettings?.tertiary_color ?? '#ffffff'}}>Site Visit Report</h1>
                        <div className="row">
                            <div className='col-md-3 w-50 my-4'>
                                <h5 className='text-center'> Site Visit - Total Count : {siteVisitProWiseUS[0]?.totalCount}</h5>
                                <canvas ref={chartRef12}></canvas>
                            </div>
                            <div className='col-md-3 w-50 my-4'>
                                <h5 className='text-center'> Site Visit Schedule : {siteVisitSDWiseUS[0]?.totalCountSVS} & Site Visit Done : {siteVisitSDWiseUS[0]?.totalCountSVC}</h5>
                                <canvas ref={chartRef13}></canvas>
                            </div>
                        </div>
                        <h1 className='p-4 my-4 text-center' style={{'backgroundColor': businessSettings?.primary_color ?? '#ff6700', 'color': businessSettings?.tertiary_color ?? '#ffffff'}}>Project wise Site Visits Report</h1>
                        <div className='row'>
                            <div className="p-4 m-4 text-white bgGrey">
                                {/* <table className="table bg-secondary">
                                    {siteVisitProjectWise && siteVisitProjectWise.length > 0 && (
                                        <thead className="bg-dark text-white">
                                            <tr style={{ textAlign: 'center' }}>
                                                <th scope="col" className='p-4'>S.No</th>
                                                <th scope="col" className='p-4'>Property Name</th>
                                                <th scope="col" className='p-4'>Site Visit Schedule</th>
                                                <th scope="col" className='p-4'>Site Visit Completed</th>
                                                <th scope="col" className='p-4'>Site Visit Cancelled</th>
                                                {Object.keys(siteVisitProjectWise[0]).slice(0, 8).map((columnName, index) => {
                                                    if (
                                                        columnName !== 'property_id' &&
                                                        columnName !== 'property_name' &&
                                                        columnName !== 'site_visit_schedule' &&
                                                        columnName !== 'site_visit_completed' &&
                                                        columnName !== 'site_visit_cancelled'
                                                    ) {
                                                        return <th key={index} scope="col">{columnName}</th>;
                                                    }
                                                    return null;
                                                })}
                                            </tr>
                                        </thead>
                                    )}
                                    <tbody>{renderTableRows()}</tbody>
                                    <tr className="bg-dark text-white" style={{ textAlign: 'center' }}>
                                        <td></td>
                                        <td className='p-4'>
                                            <strong>Total</strong>
                                        </td>
                                        <td className='p-4'>{totalSchedule}</td>
                                        <td className='p-4'>{totalCompleted}</td>
                                        <td className='p-4'>{totalCancelled}</td>
                                        {Object.keys(totalColumnCounts).slice(0, 3).map((columnName, index) => (
                                            <td key={index} className='p-4' >{totalColumnCounts[columnName]}</td>
                                        ))}
                                    </tr>
                                </table> */}
                                <table className="table bg-secondary">
                                    {siteVisitProjectWise && siteVisitProjectWise?.length > 0 && (
                                        <thead className='bg-dark text-white'>
                                            <tr style={{ textAlign: 'center' }}>
                                                <th scope="col">S.no</th>
                                                {Object.keys(siteVisitProjectWise[0])
                                                    .slice(0, 8)
                                                    .map((columnName) => (
                                                        <React.Fragment key={columnName}>
                                                            {columnName !== 'site_visit_cancelled' && columnName !== 'property_name' && columnName !== 'property_id' && columnName !== 'site_visit_completed' && columnName !== 'site_visit_schedule' && columnName !== 'lead_count' && columnName !== 'booking'  && (
                                                                <th scope="col">{columnName}</th>
                                                            )}
                                                            {columnName === 'property_name' && <th scope="col">Property Name</th>}
                                                            {columnName === 'site_visit_cancelled' && <th scope="col">Site Visit Cancelled</th>}
                                                            {columnName === 'site_visit_completed' && <th scope="col">Site Visit Completed</th>}
                                                            {columnName === 'site_visit_schedule' && <th scope="col">Site Visit Schedule</th>}
                                                            {columnName === 'site_visit_count' && <th scope="col">Site Visit Count</th>}
                                                        </React.Fragment>
                                                    ))}
                                            </tr>
                                        </thead>
                                    )}
                                    <tbody>
                                        {siteVisitProjectWise.map((row, index) => {
                                            totalSVCA += row.site_visit_cancelled;
                                            totalSVCO += row.site_visit_completed;
                                            totalSVS += row.site_visit_schedule;

                                            
                                            const numberOfFields = Object.keys(siteVisitProjectWise[0]).slice(0, 8).length;
                                            ggg = (numberOfFields -5)

                                            return (
                                                <tr key={index} style={{ textAlign: 'center' }}>
                                                    <td>{index + 1}.</td>
                                                    {Object.keys(siteVisitProjectWise[0])
                                                        .slice(0, 8)
                                                        .map((columnName) => (
                                                            <React.Fragment key={columnName}>
                                                                {columnName !== 'property_id' && (
                                                                    <td>{row[columnName] !== undefined && row[columnName] !== null ? row[columnName] : 0}</td>
                                                                )}
                                                            </React.Fragment>
                                                        ))}
                                                </tr>
                                            );
                                        })}

                                    <tr className="bg-dark text-white" style={{ textAlign: 'center' }}>
                                        <td></td>
                                        <td className='p-4'>
                                            <strong>Total</strong>
                                        </td>
                                        <td className='p-4'>{totalSchedule}</td>
                                        <td className='p-4'>{totalCompleted}</td>
                                        <td className='p-4'>{totalCancelled}</td>
                                        {Object.keys(totalColumnCounts).slice(0, ggg).map((columnName, index) => (
                                            <td key={index} className='p-4' >{totalColumnCounts[columnName]}</td>
                                        ))}
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <h1 className='p-4 my-4 text-center' style={{'backgroundColor': businessSettings?.primary_color ?? '#ff6700', 'color': businessSettings?.tertiary_color ?? '#ffffff'}}>Project wise Site Visits Report List</h1>
                    <div className='row'>
                        <div className="p-4 m-4">
                            <table className="table bg-secondary">
                                <thead className="bg-dark text-white" >
                                    <tr>
                                        <th className="p-4" scope="col">S.No</th>
                                        <th className="p-4" scope="col">Property Name</th>
                                        <th className="p-4" scope="col">Contact Name</th>
                                        <th className="p-4" scope="col">Contact No</th>
                                        <th className="p-4" scope="col">Assign Name</th>
                                        <th className="p-4" scope="col">Site Visit Created</th>
                                        <th className="p-4" scope="col">Site Visit Updated</th>
                                        <th className="p-4" scope="col">Current Status</th>
                                        <th className="p-4" scope="col">Agenda</th>
                                        <th className="p-4" scope="col">Updated Notes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {siteVisitProjectWiseList.map((row, index) => (
                                        <tr key={index}>
                                            <td className="p-4 my-4">{index + 1}.</td>
                                            <td className="p-4 my-4">{row.property_name}</td>
                                            <td className="p-4 my-4">{row.contact_name}</td>
                                            <td className="p-4 my-4">{row.contact_no}</td>
                                            <td className="p-4 my-4">{row.assign_to_name}</td>
                                            <td className="p-4 my-4">{row.created_date}</td>
                                            <td className="p-4 my-4">{row.updated_date}</td>
                                            <td className="p-4 my-4">{row.current_status}</td>
                                            <td className="p-4 my-4">{row.agenda}</td>
                                            <td className="p-4 my-4">{row.last_note}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                ): (<></>)}
            </div>

        </>
    )
}

export { Console }
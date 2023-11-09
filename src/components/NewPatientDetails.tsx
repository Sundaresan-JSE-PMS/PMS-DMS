import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {Tooltip, Accordion, AccordionDetails, AccordionSummary, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, Stack, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { FC } from "react";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { CustomOkButton } from "./CustomOkButton";
import { CustomNoButton } from "./CustomNoButton";
import { Line } from "react-chartjs-2";
import { ChartOptions, LegendItem, Plugin } from "chart.js";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { ExpandMoreRounded } from "@mui/icons-material";
import { Table } from "./Table";
import { MRT_ColumnDef } from "material-react-table";
import { ExportToCsv } from "export-to-csv";


export interface PatientDetails {
    newData: boolean;
    isDialogOpened: boolean;
    handleCloseDialog: Function;
    key: string;
    patient_id: string;
    device: {
      "resourceType": string;
      "id": string;
      "meta": {
          "versionId": string;
          "lastUpdated": string;
      };
      "status": string;
      "patient": {
        "reference": string
      };
      "location": {
        "reference": string
      };
      "identifier": 
          {
              "system": string;
              "value": string;
          }[];
      
    }[];
    patient_resource_id: string;
    observation_resource: {
      "resourceType": string;
      "id": string;
      "meta": {
          "versionId": string;
          "lastUpdated": string;
      },
      "identifier": 
          {
              "value": string;
          }[];
      "status": string;
      "category":
          {
              "coding":
                  {
                      "system": string;
                      "code": string;
                      "display": string;
                  }[];
          }[];
      "code": {
          "coding": 
              {
                  "system": string;
                  "code": string;
                  "display": string;
              }[];
          
          "text": string;
      };
      "subject": {
          "reference": string;
      };
      "device": {
          "reference": string;
      };
      "component": 
          {
              "code": {
                  "coding": 
                      {
                          "system": string;
                          "code": string;
                          "display": string;
                      }[];
                  "text": string;
              };
              "valueQuantity": {
                  "value": number;
                  "unit": string;
                  "system": string;
                  "code": string;
              };
          }[];
    }[];
    communication_resource: {
      meta: any;
      "id" : string;
      "status" : string;
      "resourceType": string;
      "sent": string;
      "category" : {
      "coding" : {
          "system" : string;
          "code" : string;
          }[];
          "text" : string;
      }[];
      "subject": {
          "reference": string;
      };
      "sender": {
          "reference": string;};
      "payload":{
          "contentReference":{
              "display": string;
          };}[];
      "extension":
          {
              "url": string;
              "valueCodeableConcept": {
                  "coding": {
                      "system": string;
                      "code": string;
                      "display": string;
                  }[];
              };
          }[];
    }[];
    patient_name: string;
  }
  type TemperatureData = {
    labels: any[];
    datasets: any[]; 
    };

export const NewPatientDetails: FC<PatientDetails> = (props): JSX.Element => {
    // const [communication, setCommunication] = useState([[{
    //     "resource":{
    //         "resourceType": String,
    //         "id": String,
    //         "meta": {
    //             "versionId": String,
    //             "lastUpdated": String
    //         },
    //         "extension": [
    //             {
    //                 "url": String,
    //                 "valueCodeableConcept": {
    //                     "coding": [
    //                         {
    //                             "system": String,
    //                             "code": String,
    //                             "display": String
    //                         }
    //                     ]
    //                 }
    //             },
    //             {
    //                 "url": String,
    //                 "valueCodeableConcept": {
    //                     "coding": [
    //                         {
    //                             "system": String,
    //                             "code": String,
    //                             "display": String
    //                         }
    //                     ]
    //                 }
    //             }
    //         ],
    //         "status": String,
    //         "category": [
    //             {
    //                 "coding": [
    //                     {
    //                         "system": String,
    //                         "code": String
    //                     }
    //                 ],
    //                 "text": String
    //             }
    //         ],
    //         "subject": {
    //             "reference": String
    //         },
    //         "sender": {
    //             "reference": String
    //         },
    //         "payload": [
    //             {
    //                 "contentReference": {
    //                     "display": String
    //                 }
    //             }
    //         ]
    //     }}
    // ]])
    const [rendergraph, setrendergraph] = useState(false)
    const [varq, setvarq] = useState(false)
    const [graphData, setGraphData] = useState(false)
    const [timeFrame, setTimeFrame] = useState(5)
    const [times, setTimes] = useState<Array<any>>([])
    const [dataset, setDataSet] = useState([[{}]])
    const [S_and_D, setS_and_D] = useState(0)
    const [downloadConfirmation, setDownloadConfirmation] = useState(false)
    const chartRef1 = useRef<any | null>(null);
    const chartRef2 = useRef<any | null>(null);
    const chartRef3 = useRef<any | null>(null);
    const [selectedLegends, setSelectedLegends] = useState<any>([])
    const [newalarm, setNewAlarm] = useState<{ date: string; time: { val: string; alarm: string[]; priority: string[]; }; }[][]>([]);
    const [commeta, setcommeta] = useState<number[]>([])
    const [tableVisisble, setTableVisible] = useState(false)
    
    const csvOptions = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalSeparator: '.',
        showLabels: true,
        useBom: true,
        useKeysAsHeaders: false,
        headers: ['Parameter','Values'],
    };
    const csvExporter = new ExportToCsv(csvOptions);
    const columns = useMemo<MRT_ColumnDef[]>(
        () => [
            
            {
                accessorKey: "date",
                header: "Date",
                id: "date",
                // maxSize: 50,
                // muiTableHeadCellProps: {
                //     align: 'center',
                //   },
                //   muiTableBodyCellProps: {
                //     align: 'center',
                //   },
            },
            {
                accessorKey: "time",
                header: "Time",
                id: "time",
                // maxSize: 50,
                // muiTableHeadCellProps: {
                //     align: 'center',
                //   },
                //   muiTableBodyCellProps: {
                //     align: 'center',
                //   },
            },
            {
                accessorKey: "device",
                header: "Device",
                id: "device", 
            },
            {
                accessorKey: "alarm",
                header: "Alarm",
                id: "alarm",
                Cell: ({ cell }) => {
                    if(cell.getValue()!=undefined ){
                        return (
                            <Box width={'100%'} height={'100%'} display={'flex'} flexWrap={'wrap'}>
                            {cell.getValue<Array<string>>().map((val) => {
                            return (
                                <Tooltip title={val[0]} placement="top">
                                    <Box
                                        display={'inline-block'}
                                        paddingTop={"5px"}
                                        paddingBottom={"5px"}
                                        paddingLeft={'10px'}
                                        paddingRight={'10px'}
                                        justifyContent={'center'}
                                        textAlign={'center'}
                                        color={'black'}
                                        margin={'10px'}
                                        sx={() => ({
                                            borderRadius: "20px",
                                            backgroundColor:
                                            val[1] == "Low Priority"
                                            ? "cyan"
                                            : val[1] == "Medium Priority"
                                            ? "yellow  " : "red ",
                                        })}
                                    >
                                        {(() => {
                                            var initials = '';
                                            val[0].split(' ').forEach(word => {
                                                if(word.length>0){
                                                    initials+=word[0]
                                                }
                                            });
                                            return initials
                                        })()}
                                    </Box>
                                </Tooltip>
    
                            )
                        })}
                        </Box>
                        
                        )
                    }
                    
                    // <Box
                    //     display={'inline-block'}
                    //     paddingTop={"5px"}
                    //     paddingBottom={"5px"}
                    //     paddingLeft={'10px'}
                    //     paddingRight={'10px'}
                    //     justifyContent={'center'}
                    //     textAlign={'center'}
                    //     color={'black'}
                    //     sx={() => ({
                    //         borderRadius: "20px",
                    //         backgroundColor:
                    //         row.original.priority == "Low Priority"
                    //         ? "cyan"
                    //         : row.original.priority == "Medium Priority"
                    //         ? "yellow  " : "red ",
                    //     })}
                    // >
                    //     {cell.getValue<Array>()[1]}
                    // </Box>
            },
                // muiTableHeadCellProps: {
                //     align: 'center',
                //   },
                //   muiTableBodyCellProps: {
                //     align: 'center',
                //   },
                
            },
            {
                accessorKey: "priority",
                header: "Priority",
                id: "priority",
                Cell: ({ cell }) => {
                    if(cell.getValue()!=undefined){
                        return(
                            <Box
                        width={'40%'}
                        padding={"5px"}
                        justifyContent={'center'}
                        textAlign={'center'}
                        color={'black'}
                        sx={() => ({
                            borderRadius: "5px",
                            backgroundColor:
                            cell.getValue<string>() == "Low Priority"
                            ? "#00BCD4"
                            : cell.getValue<string>() == "Medium Priority"
                            ? "#FFEB3B  " : "#F44336 "
                        })}
                    >
                        {cell.getValue<string>()}
                    </Box>
                        )
                    }
                    
                },
                maxSize: 100,
                muiTableHeadCellProps: {
                    align: 'center',
                  },
                  muiTableBodyCellProps: {
                    align: 'center',
                  },
            },

        ], []
    )
    const [rows, setRows] = useState<Array<{ date: string; time: string; alarm: string[][]; device: string }>>([]);


    useEffect(() => {props.handleCloseDialog()},[varq])
    // useEffect(() => {console.log(props.observation_resource)},[props.newData])
    const heaterYaxis = {
        "%": "y",
        "C": "y1",
        "C°": "y1"
    };
    const pulseoximeterYaxis = {
        "%": "y",
        'BPM': "y1"
    }
    const pressure1OptionYaxis = {
        "%": "y",
        "LPM": "y1",
    }
    const pressure2OptionYaxis = {
        "CmH2O": "y",
        "Bar": "y1",
    }
    useEffect(() => {
        if(props.communication_resource?.length>0){
            var x: { date: string; time: { val: string; alarm: string[]; priority: string[]; }; }[][] = props.communication_resource.map(() => []);
            var y: { date: string; time: string; alarm: string[][]; device: string; }[] = [];
            var xx: string[][] = []
            var comcheck = false
           
            props.communication_resource.map((communication,index) => {
                
                if(communication.meta.versionId!=commeta[index] && communication.extension){  
                    const lastUpdatedDate = new Date(communication.meta.lastUpdated);
                    comcheck= true
                    x[index].push({
                        date: (lastUpdatedDate.toLocaleDateString()),
                        time: {
                            val: (lastUpdatedDate.toLocaleTimeString()),
                            alarm:  communication.extension[0].valueCodeableConcept.coding.map((val) => {return val.display.toString()}),
                            priority:  communication.extension[1].valueCodeableConcept.coding.map((val) => {return val.display.toString()})
                        }
                    })
                    communication.extension[0].valueCodeableConcept.coding.map((val, index) => {  
                        xx.push([val.display.toString(), communication.extension[1].valueCodeableConcept.coding[index].display.toString()])
                    })
                    y.push({
                        date: (lastUpdatedDate.toLocaleDateString()),
                        time: (lastUpdatedDate.toLocaleTimeString()),
                        alarm: xx,
                        device: (props.device && props.device[index] ? props.device[index].identifier[1].value+" - "+props.device[index].identifier[0].value:props.observation_resource[index].identifier[0].value)
                    })
                    // xx.push([val.display.toString(), props.communication_resource.extension[1].valueCodeableConcept.coding[index].display.toString()])
                    var temp: any[] = [...commeta];
                    temp[index] = communication.meta.versionId
                    setcommeta(temp)
                }
            })
            if(comcheck){
                // var q = newalarm;
                y.map((q) => {
                    setRows((row) => [...row,q])
                })
                // setRows((row) => [...row,q])
                setNewAlarm(x)
            }
        }
        if(props.observation_resource?.length>0){
                     
        }
    },[props])
    const labels = times;
    useEffect(() => {
        setTemperatureData(() => {
            if(dataset[0]?.length > 1) {
                return (
                    {
                        labels,
                        datasets: dataset[0]
                    }
                )
            }
            else {
                return (
                    {
                        labels: [],
                        datasets: []
                    }
                )
            }
        })
        setPulseoximeterData(() => {
            if(dataset[1]?.length > 1) {
                
                return (
                    {
                        labels,
                        datasets: dataset[1]
                    }
                )
            }
            else {
                return (
                    {
                        labels: [],
                        datasets: []
                    }
                )
            }
        })
        setWeightData(() => {
           
            if(dataset[2]?.length > 0) {
                
                return (
                    {
                        labels,
                        datasets: dataset[2]
                    }
                )
            }
            else {
                return (
                    {
                        labels: [],
                        datasets: []
                    }
                )
            }
        })
        setGraphData(true)
        setrendergraph(!rendergraph)
    },[times])

    function getDataForGraph(index: number,page: number, when: string) {

        const accumulatedData: any[] = []
        var meta = 0;
        function fetchData(when: string, times:number): Promise<void> {
            return fetch(`http://3.110.169.17:9444/fhir-server/api/v4/Observation/${props.observation_resource[index]?.id}/_history?_count=1&_since=${when}&_page=${page}`,{
                credentials: "omit",
                method: "GET",
                headers: {
                    Authorization: "Basic "+ btoa("fhiruser:change-password"),
                },
            })
            .then((response) => response.json())
            .then((data: any) => {
                
                if(data.total>0){
                    
                    var lastpage = Math.floor(data.total/10)+data.total%10
                    return fetch(`http://3.110.169.17:9444/fhir-server/api/v4/Observation/${props.observation_resource[index].id}/_history?_count=1&_since=${when}&_page=${lastpage}`,{
                        credentials: "omit",
                        method: "GET",
                        headers: {
                            Authorization: "Basic "+ btoa("fhiruser:change-password"),
                        },
                    })
                    .then((response) => response.json())
                    .then((data: any) => {  
                        if(data.entry[0].resource.meta.versionId!=meta){
                            meta = data.entry[0].resource.meta.versionId
                            accumulatedData.push(data.entry[0]); 
                        }
                        
                        if (timeFrame==1?(times < 7):(times<14)) {
                            const newWhen = subtractDaysFromDate(when, 1);
                            return fetchData(newWhen,times+1); // Continue fetching recursively
                        }
                        
                    })
                }
                if (timeFrame==1?(times < 7):(times<14)) {
                    const newWhen = subtractDaysFromDate(when, 1);
                    return fetchData(newWhen,times+1); // Continue fetching recursively
                }
            })
        }
        return fetchData(when,1).then(() => accumulatedData.reverse());
    

    }

    function subtractDaysFromDate(dateString: string, days: number) {
        const date = new Date(dateString);
        date.setDate(date.getDate() - days);
        console.log(date)
        return date.toISOString();
    }




    useEffect(() => {
        let url: string[] = []
        let currentNewDate = new Date()
        let currentdate = currentNewDate.getDate().toString().padStart(2,'0')
        let currentmonth = (Number(currentNewDate.getMonth())+1).toString().padStart(2,'0')
        let currentyear = currentNewDate.getFullYear()
        let currentDate = currentyear+"-"+currentmonth+"-"+currentdate
        if(timeFrame!=-1){
            if(timeFrame==0){
                
                props.observation_resource?.map((val,i) => {
                    console.log(val)
                    let prevdate = ""
                    url.push(`http://3.110.169.17:9444/fhir-server/api/v4/Observation/${props.observation_resource[i].id}/_history?_since=${currentDate}T00:00:00Z&_count=10000`)
                    Promise.all(
                        
                        url.map((query) => {
                            
                            return fetch(query, {
                                credentials: "omit",
                                method: "GET",
                                headers: {
                                    Authorization: "Basic "+ btoa("fhiruser:change-password"),
                                },
                            })
                            .then((response) => response.json())
                            .then((data) => {
                                if(data.total===0){return null}
                                if(((data.entry[0].resource.meta.lastUpdated).toString())==prevdate){return null}
                                
                                prevdate = (data.entry[0].resource.meta.lastUpdated).toString()
            
                                
                                return (data.entry.map((val: any)=>(val)))
                                
                            })
                        })
                        
                    )
                    .then((results) => {
                        
                        var dats = results.filter((entry) => entry!==null)
                        .reduce((accumulator, currentvalue) => accumulator.concat(currentvalue),[])
                        dats = dats.reverse()
                        
                        if(dats[1]?.resource?.component?.length>1){
                            
                            setTimes((dats.map((observation: { resource: { meta: { lastUpdated: { toString: () => string | number | Date; }; }; }; }) => {
                                let zeroth: {}[] = []
                                let first: {}[] = []
                                let second: {}[] = []
                                let third: {}[] = []
                                dats[1].resource.component.map((data: { valueQuantity: { unit: { toString: () => string; }; }; code: { text: { toString: () => string; }; }; }, index: string | number) => {
                                    if(data.valueQuantity.unit.toString() == "C" || data.valueQuantity.unit.toString()=="C°" || data.valueQuantity.unit.toString() == "C°" || data.code.text.toString()=="Set Heater" || data.code.text.toString()=="Heater Level"){
                                        let unit = data.valueQuantity.unit.toString() as keyof typeof heaterYaxis;
                                        // zeroth.push({
                                        //     label: data.code.text.toString(),
                                        //     data: observation.map((data2) => {
                                        //         if(data2?.resource?.component){
                                        //             return (
                                        //                 data2?.resource?.component[index]?.valueQuantity?.value.toString()
                                        //             )
                                        //         }
                                                
                                        //     }),
                                        //     yAxisID: heaterYaxis[unit] || "y"
                                        // })
                                        zeroth.push({
                                            label: data.code.text.toString(),
                                            data: dats.map((data2: { resource: { component: { [x: string]: { valueQuantity: { value: { toString: () => any; }; }; }; }; }; }) => {
                                                if(data2?.resource?.component){
                                                    return (
                                                        data2?.resource?.component[index]?.valueQuantity?.value.toString()
                                                    )
                                                }
                                                
                                            }),
                                            yAxisID: heaterYaxis[unit] || "y"
                                        })
                                    }
                                    else if(data.code.text.toString() == "Pulse Rate" || data.code.text.toString() == "SpO2" || data.code.text.toString() == "SPO2"){
                                        let unit2 = data.valueQuantity.unit.toString() as keyof typeof pulseoximeterYaxis;
                                        first.push({
                                            label: data.code.text.toString() ,
                                            data: dats.map((data2: { resource: { component: { [x: string]: { valueQuantity: { value: { toString: () => any; }; }; }; }; }; }) => {
                                                if(data2?.resource?.component){
                                                    return (
                                                        data2?.resource?.component[index]?.valueQuantity?.value.toString()
                                                    )
                                                }
                                            }),
                                            yAxisID: pulseoximeterYaxis[unit2] || "y"
                                        })
                                    }
                                    else if(data.valueQuantity.unit.toString() == "g"){
                                        second.push({
                                            label: data.code.text.toString(),
                                            data: dats.map((data2: { resource: { component: { [x: string]: { valueQuantity: { value: { toString: () => any; }; }; }; }; }; }) => {
                                                if(data2?.resource?.component){
                                                    return (
                                                        data2?.resource?.component[index]?.valueQuantity?.value.toString()
                                                    )
                                                }
                                            }),
                                            yAxisID: "y"
                                        })
                                    }
                                    else if(data.valueQuantity.unit.toString() == "LPM" || data.code.text.toString() == "Set FiO2")
                                    {
                                        let unit = data.valueQuantity.unit.toString() as keyof typeof pressure1OptionYaxis;
                                        zeroth.push({
                                            label: data.code.text.toString(),
                                            data: dats.map((data2: { resource: { component: { [x: string]: { valueQuantity: { value: { toString: () => any; }; }; }; }; }; }) => {
                                                if(data2?.resource?.component){
                                                    return (
                                                        data2?.resource?.component[index]?.valueQuantity?.value.toString()
                                                    )
                                                }
                                            }),
                                            yAxisID: pressure1OptionYaxis[unit] || "y"
                                        })
                                    }
                                    else if(data.valueQuantity.unit.toString() == "CmH2O" || data.valueQuantity.unit.toString() == "Bar"){
                                        let unit = data.valueQuantity.unit.toString() as keyof typeof pressure2OptionYaxis;
                                        second.push({
                                            label: data.code.text.toString(),
                                            data: dats.map((data2: { resource: { component: { [x: string]: { valueQuantity: { value: { toString: () => any; }; }; }; }; }; }) => {
                                                if(data2?.resource?.component){
                                                    return (
                                                        data2?.resource?.component[index]?.valueQuantity?.value.toString()
                                                    )
                                                }
                                            }),
                                            yAxisID: pressure2OptionYaxis[unit] || "y"
                                        })
                                    }
                                    
                                })
                                setDataSet([zeroth, first, second, third])
                                var fd = new Date(observation.resource.meta.lastUpdated.toString())
                                var t = fd.toLocaleTimeString()
                                var d = fd.getDate()+"/"+(fd.getMonth()+1)
                                console.log(d+"-"+t)
                                return(
                                    // new Date(obs.resource.meta.lastUpdated).toLocaleString())
                                    d+"-"+t
                                )
                            })))
                        }
                        

                    })
                })
                

            }
            else{
                if(props.observation_resource){
                    props.observation_resource.map((obs,index) => {
                        console.log(obs)
                        getDataForGraph(index,1,currentDate+"T00:00:00Z").then((result: any) => {
                            if(result[0]?.resource?.component?.length>1){
                                console.log(result)
                                setTimes((result.map((observation: { resource: { meta: { lastUpdated: { toString: () => string | number | Date; }; }; }; }) => {
                                    let zeroth: {}[] = []
                                    let first: {}[] = []
                                    let second: {}[] = []
                                    let third: {}[] = []
                                    result[0].resource.component.map((data: { valueQuantity: { unit: { toString: () => string; }; }; code: { text: { toString: () => string; }; }; }, index: string | number) => {
                                        if(data.valueQuantity.unit.toString() == "C" || data.valueQuantity.unit.toString()=="C°" || data.valueQuantity.unit.toString() == "C°" || data.code.text.toString()=="Set Heater" || data.code.text.toString()=="Heater Level"){
                                            let unit = data.valueQuantity.unit.toString() as keyof typeof heaterYaxis;
                                            // zeroth.push({
                                            //     label: data.code.text.toString(),
                                            //     data: observation.map((data2) => {
                                            //         if(data2?.resource?.component){
                                            //             return (
                                            //                 data2?.resource?.component[index]?.valueQuantity?.value.toString()
                                            //             )
                                            //         }
                                                    
                                            //     }),
                                            //     yAxisID: heaterYaxis[unit] || "y"
                                            // })
                                            zeroth.push({
                                                label: data.code.text.toString(),
                                                data: result.map((data2: { resource: { component: { [x: string]: { valueQuantity: { value: { toString: () => any; }; }; }; }; }; }) => {
                                                    if(data2?.resource?.component){
                                                        return (
                                                            data2?.resource?.component[index]?.valueQuantity?.value.toString()
                                                        )
                                                    }
                                                    
                                                }),
                                                yAxisID: heaterYaxis[unit] || "y"
                                            })
                                        }
                                        else if(data.code.text.toString() == "Pulse Rate" || data.code.text.toString() == "SpO2" || data.code.text.toString() == "SPO2"){
                                            let unit2 = data.valueQuantity.unit.toString() as keyof typeof pulseoximeterYaxis;
                                            first.push({
                                                label: data.code.text.toString() ,
                                                data: result.map((data2: { resource: { component: { [x: string]: { valueQuantity: { value: { toString: () => any; }; }; }; }; }; }) => {
                                                    if(data2?.resource?.component){
                                                        return (
                                                            data2?.resource?.component[index]?.valueQuantity?.value.toString()
                                                        )
                                                    }
                                                }),
                                                yAxisID: pulseoximeterYaxis[unit2] || "y"
                                            })
                                        }
                                        else if(data.valueQuantity.unit.toString() == "g"){
                                            second.push({
                                                label: data.code.text.toString(),
                                                data: result.map((data2: { resource: { component: { [x: string]: { valueQuantity: { value: { toString: () => any; }; }; }; }; }; }) => {
                                                    if(data2?.resource?.component){
                                                        return (
                                                            data2?.resource?.component[index]?.valueQuantity?.value.toString()
                                                        )
                                                    }
                                                }),
                                                yAxisID: "y"
                                            })
                                        }
                                        else if(data.valueQuantity.unit.toString() == "LPM" || data.code.text.toString() == "Set FiO2")
                                        {
                                            let unit = data.valueQuantity.unit.toString() as keyof typeof pressure1OptionYaxis;
                                            zeroth.push({
                                                label: data.code.text.toString(),
                                                data: result.map((data2: { resource: { component: { [x: string]: { valueQuantity: { value: { toString: () => any; }; }; }; }; }; }) => {
                                                    if(data2?.resource?.component){
                                                        return (
                                                            data2?.resource?.component[index]?.valueQuantity?.value.toString()
                                                        )
                                                    }
                                                }),
                                                yAxisID: pressure1OptionYaxis[unit] || "y"
                                            })
                                        }
                                        else if(data.valueQuantity.unit.toString() == "CmH2O" || data.valueQuantity.unit.toString() == "Bar"){
                                            let unit = data.valueQuantity.unit.toString() as keyof typeof pressure2OptionYaxis;
                                            second.push({
                                                label: data.code.text.toString(),
                                                data: result.map((data2: { resource: { component: { [x: string]: { valueQuantity: { value: { toString: () => any; }; }; }; }; }; }) => {
                                                    if(data2?.resource?.component){
                                                        return (
                                                            data2?.resource?.component[index]?.valueQuantity?.value.toString()
                                                        )
                                                    }
                                                }),
                                                yAxisID: pressure2OptionYaxis[unit] || "y"
                                            })
                                        }
                                    })
                                    setDataSet([zeroth, first, second, third])
                                    var fd = new Date(observation.resource.meta.lastUpdated.toString())
                                    var t = fd.toLocaleTimeString()
                                    var d = fd.getDate()+"/"+(fd.getMonth()+1)
                                    return(
                                        // new Date(obs.resource.meta.lastUpdated).toLocaleString())
                                        d+"-"+t
                                    )
                                })))
                            }
                        })
                    })
                    
                }
                

            }
        }
        

        // let temparr: any[] = []
        

        
        //   })
    },[timeFrame])
    const realtimeDataDisplay = () => {
        if(props.newData){
            return (
                <div>
                    <Stack
                    direction={'row'}
                    divider={
                    <Divider orientation='vertical' flexItem/>
                    }
                    sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: {
                    xs: "2rem",
                    sm: "2rem",
                    md: "4rem",
                    lg: "4rem",
                    xl: "4rem",
                    },
                    mt: {
                    xs: 5,
                    sm: 6,
                    md: 7,
                    lg: 8,
                    },
                    mb: {
                    xs: 5,
                    sm: 6,
                    md: 7,
                    lg: 8,
                    },
                    justifyContent: "center",
                    }}
                >
                    {props.observation_resource?.map((obs) => {
                        var x = 0;
                        if(obs.identifier[0].value=="PMS-SYRINGE"){
                            
                            return (
                                obs.component?.map((val) => {
                                    if(x==0){
                                        x+=1
                                        return(
                                            <Stack alignItems={'center'} spacing={'10px'}>
                                                <Typography variant="subtitle1" >
                                                    Mode
                                                </Typography>
                                                <div style={{ display: 'flex',marginLeft:'auto', marginRight:'auto', paddingRight:'10px' }}>
                                                <Typography variant='h4'>
                                                {val.code.text}
                                                    
                                                </Typography>
                                                
                                                </div>
                                            </Stack>
                                        )
                                    }
                                    else{
                                        return(
                                            <Stack alignItems={'center'} spacing={'10px'}>
                                            <Typography variant="subtitle1" >
                                                {val.code.text}
                                            </Typography>
                                            <div style={{ display: 'flex',marginLeft:'auto', marginRight:'auto', paddingRight:'10px' }}>
                                            <Typography variant='h4'>
                                                {Math.round((val.valueQuantity?.value + Number.EPSILON) * 100) / 100}&nbsp;
                                            </Typography>
                                            <Typography variant='h5'>
                                                {val.valueQuantity?.unit}
                                            </Typography>
                                            </div>
                                        </Stack>
                                        )
                                    }
                                
    
                            }
                                )
                            )
                        }
                        else{
                            return (
                                obs.component?.map((val) => {
                                    if(val.code.text=="SpO2" || val.code.text=="SPO2"||val.code.text=="Pulse Rate"||val.code.text=="Weight"||val.code.text=="Measured Skin Temp"||val.code.text=="Set Skin Temp"||val.code.text=="PI"||val.code.text=="APNEA"||val.code.text=="Rectal Measure Temp")
                                    return(
                                    <Stack alignItems={'center'} spacing={'10px'}>
                                        <Typography variant="subtitle1" >
                                            {val.code.text}
                                        </Typography>
                                        <div style={{ display: 'flex',marginLeft:'auto', marginRight:'auto', paddingRight:'10px' }}>
                                        <Typography variant='h4'>
                                            {Math.round((val.valueQuantity?.value + Number.EPSILON) * 100) / 100}&nbsp;
                                        </Typography>
                                        <Typography variant='h5'>
                                            {val.valueQuantity?.unit}
                                        </Typography>
                                        </div>
                                    </Stack>
                                )
    
                            }
                                )
                            )
                        }
                        
                        
                    })}
                    
                    </Stack>
                </div>
            )
        }
        else{
            return ( <Typography variant="h4" sx={{fontWeight:'bold'}}>No Therapy Running</Typography>)
        }
    }
    const handleExportData = () => {
        if(temperatureData.labels.length!=0 && selectedLegends.length!=0){
            let vvtemp: any[] = []
            selectedLegends.map((item: any) => {
                temperatureData.datasets.map((val: { data: any; label: any; }) => {
                    if(val.label == item){
                        vvtemp.push(val.data)
                    }
                })
                pulseoximeterData.datasets.map((val: { data: any; label: any; }) => {
                    if(val.label == item){
                        vvtemp.push(val.data)
                    }
                })
                weightData.datasets.map((val: { data: any; label: any; }) => {
                    if(val.label == item){
                        vvtemp.push(val.data)
                    }
                })
            })
            let temprow = [];
            temprow.push(selectedLegends.map((vals: any, index: number) => {
                return (
                    {
                        Parameter: vals,
                        Values: vvtemp[index]
                    }
                )
            }))
            csvExporter.generateCsv(temprow[0])
        }
        setDownloadConfirmation(false)
    };
    
    const [temperatureData, setTemperatureData] = useState<TemperatureData>({
        labels: [], // Initially, there are no labels
        datasets: [], // Initially, there are no datasets
    })
    const [weightData, setWeightData] = useState<TemperatureData>({
        labels: [], // Initially, there are no labels
        datasets: [], // Initially, there are no datasets
    })
    const [pulseoximeterData, setPulseoximeterData] = useState<TemperatureData>({
    labels: [], // Initially, there are no labels
    datasets: [], // Initially, there are no datasets
    })
    const getOrCreateLegendList = (_chart: any, id: string) => {
        const legendContainer = document.getElementById(id);
        let listContainer = legendContainer!.querySelector('div');
        if (!listContainer) {
          listContainer = document.createElement('div');
          listContainer.style.display = 'flex';
          listContainer.style.flexDirection = 'row';
          listContainer.style.flexWrap = 'wrap'

          listContainer.className = 'listContainer';
          legendContainer!.appendChild(listContainer);
        }
      
        return listContainer;
    }
    const infscrollfunc = (page: Number) => {
        props.communication_resource.map((communication,index ) => {
            fetch(`http://3.110.169.17:9444/fhir-server/api/v4/Communication/${communication.id}/_history/?_page=${page}`, {
            credentials: "omit", // send cookies and HTTP authentication information
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Basic " + btoa("fhiruser:change-password"), // set HTTP basic auth header
            },
            })
            .then((response) => response.json())
            .then((data) => {
                let x: { date: string; time: string; alarm: string[][]; device: string; }[] = []
                data.entry.map((commres: any) => {
                    if(commres.resource.extension){
                        const lastUpdatedDate = new Date((commres.resource.meta.lastUpdated).toString());
                        var xx: string[][] = []
                        commres.resource.extension[0].valueCodeableConcept.coding.map((val: { display: { toString: () => string; }; },index: string | number) => 
                            {  
                            xx.push([val.display.toString(), commres.resource.extension[1].valueCodeableConcept.coding[index].display.toString()])
                            }
                        )
                        x.push({
                            date: (lastUpdatedDate.toLocaleDateString()),
                            time: (lastUpdatedDate.toLocaleTimeString()),
                            alarm: xx,
                            device: (props.device && props.device[index] ? props.device[index].identifier[0].value:props.observation_resource[index].identifier[0].value)
                        })
    
                    }
                })
                x.map((val) => {
                    setRows((rows) => [...rows,val])
                })
            })
        })
    }
    const graphDataDisplay =  useMemo(() =>{
        const temperatureOption = {
            animation: false,
            tension: 0.3,
            responsive: true,
        
            // legend: {
            //     position: 'bottom'
            // },
            interaction: {
              mode: 'index' as const,
              intersect: false,
            },
            
            stacked: false,
            plugins: {
                decimation:{
                    enabled: true,
                    algorithm: 'min-max',
                },
              colors: {
                forceOverride: true
              },
              legend: {
                display: false,
              },
             // eslint-disable-next-line @typescript-eslint/ban-ts-comment
             //   @ts-ignore
              htmlLegend: {
                // ID of the container to put the legend in
                containerID: 'legend-container',
              },
              zoom: {
                // pan: {
                //     enabled: true,
                //     mode: 'x',
                // },
                zoom: {
                    // pinch: {
                    //     enabled: true       // Enable pinch zooming
                    // },
                    wheel: {
                        enabled: true,       // Enable wheel zooming
                        modifierKey: 'ctrl'
                    },
                    
                    mode: 'x',
    
                }
            }
            },
            scales: {
                
                x: {
                    ticks: {
                        autoSkip: true,
                        maxTicksLimit: 10
                    },
                    border: {
                        display: true
                    },
                    grid: {
                        display: true,
                        drawOnChartArea: true,
                        drawTicks: true,
                        color: 'grey'
                    }
                },
              y: {      // Celcius
                type: 'linear' as const,
                display: true,
                position: 'left' as const,
                grid: {
                    color: '#303030',
                    drawOnChartArea: true,
                  },
                title: {
                    display: true,
                    text: "Percentage (%)"
                }
              },
              y1: {     // %
                type: 'linear' as const,
                display: true,
                position: 'right' as const,
                grid: {
                    color: '#303030',  
                  drawOnChartArea: false,
                },
                title: {
                    display: true,
                    text: "Temperature (C°)"
                }
              },
            },
        };
        const weightOption = {
            animation: false,
            tension: 0.3,
            responsive: true,
            // legend: {
            //     position: 'bottom'
            // },
            interaction: {
              mode: 'index' as const,
              intersect: false,
            },
            stacked: false,
            plugins: {
                decimation:{
                    enabled: true,
                    algorithm: 'min-max',
                },
              colors: {
                forceOverride: true
              },
              legend: {
                display: false
              },
              htmlLegend: {
                // ID of the container to put the legend in
                containerID: 'legend-container3',
              },
              zoom: {
                // pan: {
                //     enabled: true,
                //     mode: 'x',
                    
                // },
                zoom: {
                    // pinch: {
                    //     enabled: true ,      // Enable pinch zooming
                    //     modifierKey: 'ctrl'
                    // },
                    wheel: {
                        enabled: true,       // Enable wheel zooming
                        modifierKey: 'ctrl'
                    },
                    mode: 'x',
                }
            }
            },
            scales: {
                x: {
                    ticks: {
                        autoSkip: true,
                        maxTicksLimit: 10
                    }
                },
              y: {     //g
                type: 'linear' as const,
                display: true,
                position: 'left' as const,
                grid: {
                    color: '#303030',
                    drawOnChartArea: true,
                  },
                title: {
                    display: true,
                    text: "Grams (g)"
                }
                },
            },
        };
        const pulseoximeterOption = {
            animation: false,
            tension: 0.3,
            responsive: true,
            // legend: {
            //     position: 'bottom'
            // },
            interaction: {
              mode: 'index' as const,
              intersect: false,
            },
            stacked: false,
            plugins: {
                decimation:{
                    enabled: true,
                    algorithm: 'min-max',
                },
              colors: {
                forceOverride: true
              },
              legend: {
                display: false
              },
              htmlLegend: {
                // ID of the container to put the legend in
                containerID: 'legend-container2',
              },
              zoom: {
    
                zoom: {
                    wheel: {
                        enabled: true,       // Enable wheel zooming
                        modifierKey: 'ctrl'
                    },
                    mode: 'x',
                }
            }
            },
            scales: {
                x: {
                    ticks: {
                        autoSkip: true,
                        maxTicksLimit: 10
                    }
                },
              y: {      // Celcius
                type: 'linear' as const,
                display: true,
                position: 'left' as const,
                title: {
                    display: true,
                    text: "Percentage (%)"
                },
                grid: {
                    color: '#303030',
                    drawOnChartArea: true,
                  },
              },
              y1: {     // %
                type: 'linear' as const,
                display: true,
                position: 'right' as const,
                grid: {
                    drawOnChartArea: false,
                  },
                title: {
                    display: true,
                    text: "Beats Per Minuite (BPM)"
                }
              },
            },
        };
        const temperatureLegendPlugin: Plugin = {
            id: 'htmlLegend',
            afterUpdate(chart, _args, options) {
                const ul = getOrCreateLegendList(chart, options.containerID);
              // Remove old legend items
              while (ul.firstChild) {
                ul.firstChild.remove();
              }
              ul.style.margin = '0px';
              ul.style.padding = '0px';
              ul.style.lineHeight = '300%';
              ul.style.gap='5%';
              // Reuse the built-in legendItems generator
             
    
              
              const items: LegendItem[] = chart.options?.plugins?.legend?.labels?.generateLabels?.(chart) || [];
    
    items.forEach((item) => {
      if (item.text !== '') {
                    const li = document.createElement('div');
                    li.style.alignItems = 'left';
                    li.style.cursor = 'pointer';
                    li.style.display = 'flex';
                    li.style.flexDirection = 'row';
                    // li.style.flexWrap = 'wrap'
                    li.style.padding = '0px';
                    li.style.margin = '0px';
                    // li.style.backgroundColor= 'red';
              
                    li.onclick = () => {
                      setS_and_D(2)
                      const type = (chart.config as any)?.type;
                     
                      if (type === 'pie' || type === 'doughnut') {
                        // Pie and doughnut charts only have a single dataset and visibility is per item
                        if (item.index !== undefined) {
                            chart.toggleDataVisibility(item.index);
                          }
                      } else {
                        if (item.datasetIndex !== undefined) {
                          chart.setDatasetVisibility(item.datasetIndex, !chart.isDatasetVisible(item.datasetIndex));
                          chart.isDatasetVisible(item.datasetIndex)
                            ? setSelectedLegends((prev: any) => [...prev, item.text])
                            : setSelectedLegends((current: any[]) => current.filter((lol) => lol !== item.text));
                        }
                      }
                      chart.update();
                    };
              
                    // Color box
                    const boxSpan = document.createElement('span');
                    boxSpan.style.background = item.hidden ? 'transparent' : (typeof item.fillStyle === 'string' ? item.fillStyle : 'transparent');
                    // boxSpan.style.borderColor = item.strokeStyle;
                    boxSpan.style.border = `2px solid ${item.strokeStyle}`;
                    boxSpan.style.display = 'inline-block';
                    boxSpan.style.flexShrink = '0px';
                    boxSpan.style.height = '20px'; // Added height
                    boxSpan.style.marginRight = '5px';
                    boxSpan.style.width = '20px';
                    boxSpan.style.borderRadius = '8px'
        
              
                    // Text
                    const textContainer = document.createElement('p');
                    textContainer.style.fontSize = '12px'
                    textContainer.style.color = 'white';
                    textContainer.style.marginTop = '-12px';
                    textContainer.style.padding = '0px';
                    // textContainer.style.textDecoration = item.hidden ? 'line-through' : '';
              
                    const text = document.createTextNode("- "+item.text);
                    textContainer.appendChild(text);
              
                    li.appendChild(boxSpan);
                    li.appendChild(textContainer);
                    ul.appendChild(li);
                }
    
              });
            }
        }
        return (
            <div style={{marginTop:'25px'}}>
                {   
                    graphData && (<>
                            <Stack direction={'row'} width={"100%"} justifyContent={'space-between'}>
                            {/* <Button color="primary" startIcon={<FileDownloadIcon />} variant="contained" sx={{width:'100px', marginLeft:'2%'}}>
                                    Export
                            </Button> */}
                            <Stack width={'100%'} direction={{ xs: 'row', sm: 'row', md:'row', lg:'column' }} marginBottom={{ xs: '30px', sm: '30px', md:'20px', lg:'20px' }}>
                            {/* <Typography variant='h5' paddingLeft={'2%'}>Trends</Typography> */}
                            <Stack width={'100%'} direction={'row'} textAlign={'center'}  >
                                
                                <ToggleButtonGroup value={timeFrame} exclusive size="small" sx={{marginLeft:'auto', marginRight:'1%'}}>
                                    <ToggleButton value={0} key="left" sx={{height:'30px', width:'50px', borderTopLeftRadius:'20px',borderBottomLeftRadius:'20px', fontSize:'10px', textTransform:'capitalize'}} onClick={() => {setTimeFrame(0)}}>
                                    Day
                                    </ToggleButton>,
                                    <ToggleButton value={1} key="center" sx={{height:'30px', width:'55px', fontSize:'10px', textTransform:'capitalize'}} onClick={() => {setTimeFrame(1)}}>
                                        1 Week
                                    </ToggleButton>,
                                    <ToggleButton value={2} key="right" sx={{height:'30px', width:'58px', borderTopRightRadius:'20px',borderBottomRightRadius:'20px', fontSize:'10px', textTransform:'capitalize'}} onClick={() => {setTimeFrame(2)}}>
                                        2 Weeks
                                    </ToggleButton>
                                </ToggleButtonGroup>
                                <ToggleButtonGroup value={S_and_D} exclusive size="small" sx={{marginRight:'1%'}}>
                                    <ToggleButton value={0} key="left" sx={{height:'30px', width:'80px', borderTopLeftRadius:'20px',borderBottomLeftRadius:'20px', fontSize:'10px', textTransform:'capitalize'}} onClick={() => {
                                        setS_and_D(0)
                                        let temp: any[] = []
                                        chartRef1.current.data.datasets.forEach((dataset: { label: any; }, datasetIndex: any) => {
                                            temp.push(dataset.label)    
                                            chartRef1.current.setDatasetVisibility(datasetIndex, true);
                                            });
                                        chartRef1.current.update();
                                        chartRef2.current.data.datasets.forEach((dataset: { label: any; }, datasetIndex: any) => {
                                            temp.push(dataset.label)
                                            chartRef2.current.setDatasetVisibility(datasetIndex, true);
                                            });
                                        chartRef2.current.update();
                                        chartRef3.current.data.datasets.forEach((dataset: { label: any; }, datasetIndex: any) => {
                                            temp.push(dataset.label)
                                            chartRef3.current.setDatasetVisibility(datasetIndex, true);
                                            });
                                        chartRef3.current.update();
                                        setSelectedLegends(temp.filter(val => val!=""))
                                    }}>
                                        Select all
                                    </ToggleButton>
                                    <ToggleButton value={1} key="right" sx={{height:'30px', width:'80px', borderTopRightRadius:'20px',borderBottomRightRadius:'20px', fontSize:'10px', textTransform:'capitalize'}}  onClick={() => {
                                        setS_and_D(1)
                                        chartRef1.current.data.datasets.forEach((_dataset: any, datasetIndex: any) => {
                                            chartRef1.current.setDatasetVisibility(datasetIndex, false);
                                            });
                                        chartRef1.current.update();
                                        chartRef2.current.data.datasets.forEach((_dataset: any, datasetIndex: any) => {
                                            chartRef2.current.setDatasetVisibility(datasetIndex, false);
                                            });
                                        chartRef2.current.update();
                                        chartRef3.current.data.datasets.forEach((_dataset: any, datasetIndex: any) => {
                                            chartRef3.current.setDatasetVisibility(datasetIndex, false);
                                            });
                                        chartRef3.current.update();
                                        setSelectedLegends([])
                                    }}>
                                        Deselect all
                                    </ToggleButton>
                                </ToggleButtonGroup>
                                <Button color="primary" startIcon={<FileDownloadIcon />} variant="contained" sx={{  borderRadius:'25px', width:'100px', height:'30px', textTransform:'capitalize', fontSize:'10px', color:'white'}} onClick={() => {
                                    setDownloadConfirmation(true)
                                }}>
                                    Download
                                </Button>
                            </Stack>
                            </Stack>
                            <Dialog
                                open={downloadConfirmation}
                                onClose={() => {setDownloadConfirmation(false)}}
                                scroll='paper'
                                PaperProps={{style:{borderRadius:'25px', boxShadow: `0px 0px 40px 1px #404040`, border:'0.4px solid #505050', backgroundImage:'linear-gradient(to bottom, #111522, #111522, #111522)', minWidth:'400px', minHeight:'200px'}}} // borderRadius:'3%', boxShadow: `0px 0px 20px 10px #7B7B7B`, border:'1px solid #7B7B7B
                            >
                                <DialogTitle id="responsive-dialog-title" sx={{textAlign:"center", fontWeight:'bold', padding:'9%'}}>
                                    {`Confirm Download data of the following parameters` }
                                </DialogTitle>
                                <DialogContent sx={{textAlign:"center", marginBottom:'auto', paddingBottom:'9%'}}>
                                    <Stack marginLeft={'auto'} marginRight={'auto'} width={'70%'} spacing={'5px'} justifyContent={'center'} textAlign={'center'}>
                                        {selectedLegends.map((vals: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined) => {
                                            return (
                                                <Box  border={'0.3px solid grey'}>{vals}</Box>
                                            )
                                        })}
                                    </Stack>
                                </DialogContent>
                                <DialogActions sx={{paddingBottom:'5%'}}>
                                    <Stack direction={'row'} width={'100%'} justifyContent={'space-around'}>    
                                    <Box sx={{minWidth:'90px', minHeight:'45px'}} onClick={() => {setDownloadConfirmation(false)}}><CustomNoButton text="Cancel"></CustomNoButton></Box>
                                    
                                    <Box sx={{minWidth:'90px', minHeight:'45px'}} onClick={handleExportData}><CustomOkButton text="Confirm"></CustomOkButton></Box>
                                    </Stack>
                                    
                                </DialogActions>
                            </Dialog>
                            

                            </Stack>
                            
                            {/* <div style={{justifyContent:'center'}}>
                                
                            </div> */}
                                {(() => {
                                    if(props.observation_resource && props.observation_resource[0]?.identifier[0]?.value?.toString()!="PMS-SYRINGE"){
                                        return (
                                            <Stack width={'100%'} height={'100%'} direction={'row'} justifyContent={'center'} divider={
                                                <Divider orientation='vertical' flexItem sx={{marginLeft:'1%',backgroundColor:'#505050', color:'#505050'}}/>
                                            }>
                                                <Stack height={'100%'} width={'95%'} spacing={'5%'} marginRight={'auto'} marginLeft={'2%'} marginTop={'2%'}>
                                                    {/* <MyChart height={'100%'} forwardedRef={chartRef1} options={temperatureOption as ChartOptions} data={temperatureData} plugins={temperatureLegendPlugin} /> */}
                                                    <Line ref={chartRef1} options={temperatureOption as ChartOptions} data={temperatureData} height={"100%"} plugins={[temperatureLegendPlugin]} ></Line>
                                                    <div id="legend-container"></div>
                                                    <Divider />
                                                    {/* <MyChart height={'100%'} forwardedRef={chartRef2} options={pulseoximeterOption as ChartOptions} data={pulseoximeterData} plugins={temperatureLegendPlugin} /> */}
                                                    <Line ref={chartRef2} options={pulseoximeterOption as ChartOptions} data={pulseoximeterData} height={'100%'} plugins={[temperatureLegendPlugin]}></Line>
                                                    <div id="legend-container2"></div>
                                                    <Divider />
                                                    {/* <MyChart height={'100%'} forwardedRef={chartRef3} options={weightOption as ChartOptions} data={weightData} plugins={temperatureLegendPlugin} />                                             */}
                                                    <Line ref={chartRef3} options={weightOption as ChartOptions} data={weightData} height={'100%'} plugins={[temperatureLegendPlugin]}></Line>
                                                    <div id="legend-container3"></div>
                                                </Stack>
                                                {/* <Box width={'35%'} justifyContent={'center'} textAlign={'center'} sx={{borderRadius:'20px', marginTop:'-50px'}}>
                                                    <Stack spacing={'10px'} sx={{marginLeft:'7%', width:'100%', justifyContent:'center', marginTop:'60px', textAlign:'center' }} className="legendBox">
                                                    
                                                    
                                                    
                                                    </Stack>

                                                    <Button color="primary"  startIcon={<FileDownloadIcon />} variant="contained" sx={{marginTop:'70%', borderRadius:'25px', width:'200px'}} onClick={() => {
                                                        setDownloadConfirmation(true)
                                                    }}>
                                                        Download
                                                    </Button>
                                                    
                                                </Box> */}

                                            </Stack>
                                        )
                                    }
                                    // if(props.observation_resource?.identifier[0]?.value?.toString()=="PMSinc" || props.observation_resource?.identifier[0]?.value?.toString()=="PMS-INC"){
                                        
                                    //     return (
                                    //         <Stack width={'100%'} height={'100%'} direction={'row'} justifyContent={'center'} divider={
                                    //             <Divider orientation='vertical' flexItem sx={{marginLeft:'1%',backgroundColor:'#505050', color:'#505050'}}/>
                                    //         }>
                                    //             <Stack height={'100%'} width={'95%'} spacing={'5%'} marginRight={'auto'} marginLeft={'2%'} marginTop={'2%'}>
                                    //                 {/* <MyChart height={'100%'} forwardedRef={chartRef1} options={temperatureOption as ChartOptions} data={temperatureData} plugins={temperatureLegendPlugin} /> */}
                                    //                 <Line ref={chartRef1} options={temperatureOption as ChartOptions} data={temperatureData} height={"100%"} plugins={[temperatureLegendPlugin]} ></Line>
                                    //                 <div id="legend-container"></div>
                                    //                 <Divider />
                                    //                 {/* <MyChart height={'100%'} forwardedRef={chartRef2} options={pulseoximeterOption as ChartOptions} data={pulseoximeterData} plugins={temperatureLegendPlugin} /> */}
                                    //                 <Line ref={chartRef2} options={pulseoximeterOption as ChartOptions} data={pulseoximeterData} height={'100%'} plugins={[temperatureLegendPlugin]}></Line>
                                    //                 <div id="legend-container2"></div>
                                    //                 <Divider />
                                    //                 {/* <MyChart height={'100%'} forwardedRef={chartRef3} options={weightOption as ChartOptions} data={weightData} plugins={temperatureLegendPlugin} />                                             */}
                                    //                 <Line ref={chartRef3} options={weightOption as ChartOptions} data={weightData} height={'100%'} plugins={[temperatureLegendPlugin]}></Line>
                                    //                 <div id="legend-container3"></div>
                                    //             </Stack>
                                    //             {/* <Box width={'35%'} justifyContent={'center'} textAlign={'center'} sx={{borderRadius:'20px', marginTop:'-50px'}}>
                                    //                 <Stack spacing={'10px'} sx={{marginLeft:'7%', width:'100%', justifyContent:'center', marginTop:'60px', textAlign:'center' }} className="legendBox">
                                                    
                                                    
                                                    
                                    //                 </Stack>

                                    //                 <Button color="primary"  startIcon={<FileDownloadIcon />} variant="contained" sx={{marginTop:'70%', borderRadius:'25px', width:'200px'}} onClick={() => {
                                    //                     setDownloadConfirmation(true)
                                    //                 }}>
                                    //                     Download
                                    //                 </Button>
                                                    
                                    //             </Box> */}

                                    //         </Stack>
                                    //     )
                                    // }
                                    // if(props.observation_resource?.identifier[0]?.value?.toString()=="PMS-SVAAS" || props.observation_resource?.identifier[0]?.value?.toString()=="PMSsvaas"){

                                    //     return (

                                    //         <Stack width={'100%'} height={'100%'} direction={'row'} divider={
                                    //             <Divider orientation='vertical' flexItem sx={{marginLeft:'1%'}}/>
                                    //         }>
                                    //             <Stack height={'100%'} width={'95%'} spacing={'5%'} marginRight={'auto'} marginLeft={'2%'} marginTop={'2%'}>
                                    //                 <Line ref={chartRef1} options={pressure1Option as ChartOptions} data={temperatureData} height={"100%"} plugins={[temperatureLegendPlugin]} ></Line>
                                    //                 <div id="legend-container"></div>
                                    //                 <Divider />
                                    //                 <Line ref={chartRef2} options={pulseoximeterOption as ChartOptions} data={pulseoximeterData} height={'100%'} plugins={[temperatureLegendPlugin]}></Line>
                                    //                 <div id="legend-container2"></div>
                                    //                 <Divider />
                                    //                 <Line ref={chartRef3} options={pressure2Option as ChartOptions} data={weightData} height={'100%'} plugins={[temperatureLegendPlugin]}></Line>
                                    //                 <div id="legend-container3"></div>
                                    //             </Stack>

                                    //         </Stack>



                                            
                                    //     )
                                    // }
                                    // if(props.observation_resource?.identifier[0]?.value?.toString()=="PMSHCM"){
                                    //     return (
                                    //         <Stack width={'100%'} height={'100%'} direction={'row'} justifyContent={'center'} divider={
                                    //             <Divider orientation='vertical' flexItem sx={{marginLeft:'1%',backgroundColor:'#505050', color:'#505050'}}/>
                                    //         }>
                                    //             <Stack height={'100%'} width={'95%'} spacing={'5%'} marginRight={'auto'} marginLeft={'2%'} marginTop={'2%'}>
                                    //                 {/* <MyChart height={'100%'} forwardedRef={chartRef1} options={temperatureOption as ChartOptions} data={temperatureData} plugins={temperatureLegendPlugin} /> */}
                                    //                 <Line ref={chartRef1} options={temperatureOption as ChartOptions} data={temperatureData} height={"100%"} plugins={[temperatureLegendPlugin]} ></Line>
                                    //                 <div id="legend-container"></div>
                                    //                 <Divider />
                                    //                 {/* <MyChart height={'100%'} forwardedRef={chartRef2} options={pulseoximeterOption as ChartOptions} data={pulseoximeterData} plugins={temperatureLegendPlugin} /> */}
                                    //                 <Line ref={chartRef2} options={pulseoximeterOption as ChartOptions} data={pulseoximeterData} height={'100%'} plugins={[temperatureLegendPlugin]}></Line>
                                    //                 <div id="legend-container2"></div>
                                    //                 <Divider />
                                    //                 {/* <MyChart height={'100%'} forwardedRef={chartRef3} options={weightOption as ChartOptions} data={weightData} plugins={temperatureLegendPlugin} />                                             */}
                                    //                 <Line ref={chartRef3} options={weightOption as ChartOptions} data={weightData} height={'100%'} plugins={[temperatureLegendPlugin]}></Line>
                                    //                 <div id="legend-container3"></div>
                                    //             </Stack>
                                    //             {/* <Box width={'35%'} justifyContent={'center'} textAlign={'center'} sx={{borderRadius:'20px', marginTop:'-50px'}}>
                                    //                 <Stack spacing={'10px'} sx={{marginLeft:'7%', width:'100%', justifyContent:'center', marginTop:'60px', textAlign:'center' }} className="legendBox">
                                                    
                                                    
                                                    
                                    //                 </Stack>

                                    //                 <Button color="primary"  startIcon={<FileDownloadIcon />} variant="contained" sx={{marginTop:'70%', borderRadius:'25px', width:'200px'}} onClick={() => {
                                    //                     setDownloadConfirmation(true)
                                    //                 }}>
                                    //                     Download
                                    //                 </Button>
                                                    
                                    //             </Box> */}

                                    //         </Stack>
                                    //     )
                                    // }
                                    return <div></div>
                                })()}
                            
                            
                                {/* <Button >Select all</Button> */}
                                
                            </>)
                }
                {
                    !graphData && (<div></div>)
                }            
            </div>
        )
    },[rendergraph])

    const alarmCard = (index: number) => {
        if(newalarm[index]){
            return (newalarm[index][0]?.time?.alarm?.map((alarm, ind) => {
                if(newalarm[index][0].time.priority[ind]=="High Priority"){
                    return (
                        <Box width={'200px'} height={'110px'} sx={{border:'1px solid red', borderRadius:'10px', margin:'15px', boxShadow: `0px 0px 10px 1px red`}} justifyContent={'center'} textAlign={'center'}>
                            <Typography variant='subtitle1' paddingTop={'13%'}><b>{alarm}</b></Typography>
                            <div style={{display:'flex', justifyContent:'center', textAlign:'center'}}>
                                <Typography variant='subtitle2' >{(newalarm[index][0].date).toString()} - {(newalarm[index][0].time.val).toString()}</Typography>
                            </div>
                            
                        </Box>
                    )
                }
                else{
                    return (
                        <Box width={'200px'} height={'110px'} sx={{border:'1px solid yellow', borderRadius:'10px', margin:'15px', boxShadow: `0px 0px 10px 1px yellow`}} justifyContent={'center'} textAlign={'center'}>
                            <Typography variant='subtitle1' paddingTop={'13%'}><b>{alarm}</b></Typography>
                            <div style={{display:'flex', justifyContent:'center', textAlign:'center'}}>
                                <Typography variant='subtitle2' >{(newalarm[index][0].date).toString()} - {(newalarm[index][0].time.val).toString()}</Typography>
                            </div>
                            
                        </Box>
                    )
                }

            }))
        }
        else{
            return <div>{index}</div>
        }
        
    }



    const connectedDevices = () => {
        if(props.device?.length>0){
            return (props.device.map((device,index) => {
                return (
                    <Box borderRadius={'10px'} justifyContent={'center'} textAlign={'center'} boxShadow={`0px 0px 10px 2px #00B1FD`} border={'1px solid #00B1FD'} height={'70px'}>
                        <Typography paddingTop={'10 px'} paddingLeft={'10px'} paddingRight={'10px'}>{device.identifier[1].value}</Typography>
                        <Typography variant="caption" paddingTop={'5px'} paddingLeft={'10px'} paddingRight={'10px'}>{device.identifier[0].value}</Typography>
                    </Box>
                )
            }))
        }
        return "No device currently connected"
        
    }

    return (
        <React.Fragment>
            <Dialog
                open={props.isDialogOpened}
                sx={{
                    backdropFilter :"blur(5px)"
                }}
                onClose={() =>
                {setvarq(!varq)}}
                // fullWidth
                maxWidth="lg"
                PaperProps={{sx:{minWidth:{
                    xs: '90%',
                    sm: '90%',
                    md: '50%',
                    lg: '50%',
                },maxWidth:{
                    xs: '90%',
                    sm: '90%',
                    md: '50%',
                    lg: '50%',
                },minHeight:'90%',borderRadius:'25px', boxShadow: `0px 0px 40px 1px #404040`, border:'0.4px solid #505050', backgroundImage:'linear-gradient(to bottom, #111522, #111522, #111522)' }}}
                >
                    <DialogTitle
                        sx={{
                            borderBottom:'1px solid white'
                        }}
                    >
                        {/* <IconButton sx={{marginLeft:'96%'}}><CloseRounded/></IconButton> */}
                        <Stack direction={'row'} width={'102%'} >
                            <Stack direction={'row'} width={'100%'} sx={{justifyContent:'space-between', marginLeft:'auto', marginRight:'auto'}}>
                            <Typography variant="h6" fontWeight={'regular'} >
                                {props.patient_name} 
                            
                            </Typography>
                            <Typography variant="h6">
                                {props.patient_id}
                            </Typography>
                            
                            </Stack>
                            <IconButton sx={{width:'45px', marginTop:'-4px', marginLeft:'10px'}} onClick={() => {setvarq(!varq)}}><FontAwesomeIcon style={{padding:'0px', margin:'0px'}} icon={faXmark} /></IconButton>
                        </Stack>

                        
                    </DialogTitle>
                    <DialogContent dividers={true} sx={{justifyContent:'center', overflowY: 'scroll'}}>
                        <Box justifyContent={'center'} textAlign={'center'} width={'100%'} marginTop={"20px"}>
                        {realtimeDataDisplay()}
                        </Box>
                        <Divider sx={{marginTop:'40px', marginBottom:'20px', backgroundColor:'white', color:'white'}}/>
                        <Typography variant='h5' paddingLeft={'2%'}>Connected Devices</Typography>
                        <Box marginTop={'3%'} marginLeft={'3%'} display={'flex'} textAlign={'center'} justifyContent={'left'} flexWrap={'wrap'} width={'100%'} gap={'10px'}>
                            {connectedDevices()}
                        </Box>
                        {props.observation_resource && props.observation_resource!=undefined && props.observation_resource[0].identifier[0].value.toString()!='PMS-SYRINGE' && (<>
                            <Divider sx={{marginTop:'40px', marginBottom:'20px', backgroundColor:'white', color:'white'}}/>
                            <Typography variant='h5' paddingLeft={'2%'}>Trends</Typography>
                            {graphDataDisplay}
                        </>)}
                        
                         {/* {graphDataDisplay} */}
                        {/* <Box marginTop={'3%'} marginLeft={'3%'} display={'flex'} textAlign={'center'} justifyContent={'left'} flexWrap={'wrap'} width={'100%'} gap={'10px'}>
                            {connectedDevices()}
                        </Box> */}
                       <Divider sx={{marginTop:'40px', marginBottom:'20px', backgroundColor:'white', color:'white'}}/>
                       <Typography variant='h5' paddingLeft={'2%'}>Alarms</Typography>
                       {props.communication_resource?.map((comms, index) => {
                        console.log(comms)
                        return (
                            <Accordion elevation={0} defaultExpanded={true} sx={{ width:'100%',backgroundColor:"transparent", backgroundImage:'none', marginTop:'10px' , marginBottom:"10px", border:'1px solid grey', borderRadius:'15px', '&:before': {opacity: 0}}} >
                                <AccordionSummary
                                        expandIcon={<ExpandMoreRounded sx={{ fontSize:'200%'}}/>}
                                        aria-controls="panel1a-content"
                                        id="panel1a-header"
                                        
                                        >
                                        <Typography variant='h5' component={"h2"} >{props.device && props.device[index] && props.device[index].identifier[1].value }
                                        {(props.device==undefined || (!props.device && !props.device[index])) && props.observation_resource[index].identifier[0].value}</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                <Box width={'100%'} display={'flex'} textAlign={'center'} justifyContent={'center'} flexWrap={'wrap'}>
                                    {alarmCard(index)}
                                </Box>
                                </AccordionDetails>
                            </Accordion>
                        )
                       })}
                        <Button sx={{width:'20%', height:'50px', marginLeft:'40%', marginTop:'3%', marginBottom:'3%', borderRadius:'50px', color:'white', backgroundColor:'#111522', border:'0.5px solid grey', fontWeight:50, boxShadow: `0px 0px 10px 1px #6e6f88`, textTransform:'capitalize'}}  endIcon={tableVisisble ? <KeyboardArrowUpIcon sx={{ fontSize: 80 }} /> : <KeyboardArrowDownIcon sx={{ fontSize: 80 }}  />} onClick={() => {setTableVisible(!tableVisisble);}}> 
                            <Box sx={{ fontWeight: 'regular', m: 1, fontSize:16, }}>Alarm Log</Box>
                        </Button>
                        <div  style={{marginLeft:'auto', width:'85%', marginRight:'auto'}} >
                            {tableVisisble && <Table infscrollfunc={infscrollfunc} rows={rows} columns={columns}/>}
                        </div>
                       <Divider sx={{marginTop:'40px', marginBottom:'20px', backgroundColor:'white', color:'white'}}/>
                    </DialogContent>
                </Dialog>
        </React.Fragment>
    )
}
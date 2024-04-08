
import { Box, Card, Stack, Typography } from "@mui/material";
import { isArray } from "chart.js/helpers";
import { FC, useEffect, useState } from "react";
import { NewPatientDetails } from "./NewPatientDetails";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


export interface PatientDetails {
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
    darkTheme:boolean
   
  }


export const PatientCard: FC<PatientDetails> = (props): JSX.Element => {
    console.log('PatientCard props:', props);
    const [obsResource, setObsResource] = useState<any[]>([])
    const [isOpen, setIsOpen] = useState(false);
    const [isBlinking, setIsBlinking] = useState(false);
    const [alarmColor, setAlarmColor] = useState("#F9F9F9")
    
    const [obsmeta, setobsmeta] = useState<any[]>([])
    const [commeta, setcommeta] = useState<any[]>([])
    
    // const [newData, setNewData] = useState(false);
    const [requiredForTimer, setRequiredForTimer] = useState(false)
    const [borderRadiusForRerender, setBorderRadiusForRerender] = useState(true)
    const [newData, setNewData] = useState(false)
    
    const [displayAlarm, setDisplayAlarm] = useState("")
    // const [dontRunFirstTime, setDontRunFirstTime] = useState(0)
    const getDevices = () => {
        
        if(props.device?.length>0){
           
            return (props.device?.map((val) => {
                return(
                    <Box boxShadow={`0px 0px 10px 2px #124D81`} border={props.darkTheme?'2px solid white':'2px solid #124D81'} textAlign={'center'} borderRadius={'10px'} minWidth={'70px'} maxWidth={'70px'} overflow="hidden"        // Handle overflow by hiding it
                    textOverflow="ellipsis"    >
                        <Typography variant='caption' color={ props.darkTheme?'white':"#124D81"}>
                            {val.identifier[1].value}
                        </Typography>
                    </Box>
                )
            }))
        }
        else{
            return (<Typography variant="body1" color="error">
            Patient Discharged
          </Typography>)
        }
    }

    useEffect(() => {
            if(isArray(props.observation_resource)){
            if(props.observation_resource.length>0){
                // console.log(props.observation_resource)
                var change = false
                    props.observation_resource.map((val, index) => {
                        if(val.meta.versionId!=obsmeta[index]){
                            // console.log(props.patient_id)
                            
                            var tempVar = obsmeta
                            tempVar[index] = String(val.meta.versionId)
                            setobsmeta(tempVar)
                            change = true
                            
                        }
                        
                        
                    })
                    if(change){
                        setBorderRadiusForRerender(!borderRadiusForRerender)
                        setObsResource(props.observation_resource.flat())
                        setRequiredForTimer(!requiredForTimer)
                        setNewData(true);
                    }
            }

        }
        
        if(isArray(props.communication_resource)){
            if(props.communication_resource.length>0 ){
                var change = false
                props.communication_resource.map((val, index) => {
                    if(val.meta.versionId!=commeta[index]){
                        var tempVar2 = commeta
                        tempVar2[index] = String(val.meta.versionId)
                        setcommeta(tempVar2)
                        change=true
                        
                        if(val && val.extension){
                            for(var i=0;i<val.extension[1].valueCodeableConcept.coding.length;i++){
                                if(val.extension[1].valueCodeableConcept.coding[i].code=="High Priority"){
                                    setDisplayAlarm(String(val.extension[0].valueCodeableConcept.coding[i].display))
                                    setAlarmColor('red')
                                    break
                                }
                                else {
                                    setDisplayAlarm(String(val.extension[0].valueCodeableConcept.coding[i].display))
                                    setAlarmColor('yellow')
                                }
                            } } }})}}
},[props])
        
    useEffect(() => {
        let intervalId: number | undefined;
    
        if (newData) {
          intervalId = setInterval(() => {
            setIsBlinking((prevIsBlinking) => !prevIsBlinking);
          }, 300); 
        } else {
            
          clearInterval(intervalId);
          setIsBlinking(false);
        }
    
        return () => {
          clearInterval(intervalId);
        };
      }, [alarmColor]);

    useEffect(() => {
    let timer: number | undefined;
    if(newData){
        timer = setInterval(() => {setNewData(false);setAlarmColor("#202020");clearInterval(timer)},15000)
    }

    return () => {
        
        clearInterval(timer); 
    };
    }, [requiredForTimer])

    function finddata(x: string){
        var hasvalue = false
        for(var i=0;i<obsResource.length;i++){
            let index = obsResource[i].component?.findIndex((item: { code: { text: string; }; }) => item.code.text===x)
            if(index==-1){
                continue;
            }
            else{
                if(index){
                    let data = Number(obsResource[i].component[index]?.valueQuantity.value)
                    data = Math.round((data + Number.EPSILON) * 100) / 100
                    let unit = obsResource[i].component[index]?.valueQuantity.unit
                    hasvalue = true
                    return ({data:data, unit:unit})
                }
                
            }
            
        }
        if(!hasvalue){
            return({data: "--", unit: "--"})
        }
        
    }

    
    return (
        <Box  width={{
            xs: "350px",
            sm: "500px",
            md: "500px",
            lg: "500px"
          }} sx={{borderRadius:borderRadiusForRerender?'25px':'25.5px'}}
          onClick={() => {setIsOpen(true)}}>
            <Card
          style={{ backgroundColor:props.darkTheme?'#34495F':'#FFFFFF', borderRadius: "18px", height:"300px", boxShadow: `0px 0px 10px #FFD0D0`,border: `6px solid ${isBlinking ? alarmColor : props.darkTheme?'#3C4F6C':'white'}` }}
      > 
                <Stack width={'100%'} height={'100%'}>
                    <Stack direction={'row'} display={'flex'} width={'100%'} height={'10%'} borderBottom={'1px solid grey'} paddingTop={'3%'} justifyContent={'space-between'}>
                        <Box marginLeft={'20px'}>
                            <Typography variant="subtitle2" style={{fontWeight: 'bold', fontFamily: 'Helvetica'}}  color={props.darkTheme?'white':'#7E7E7E'}>
                                {props.patient_id}
                            </Typography>
                        </Box>
                        <Box marginRight={'20px'}>
                            <Typography variant="subtitle2" style={{fontWeight: 'bold', fontFamily: 'Helvetica'}}   color={props.darkTheme?'white':'#7E7E7E'}>
                                {props.patient_name}
                            </Typography> 
                        </Box>                             
                    </Stack>
                    {newData ? (
                  
                    <Stack height={'90%'} width={'100%'} >
                    <Stack height={'50%'} width={'100%'}  direction={'row'}>
              <Box width={'50%'} >
              <div style={{marginTop:'7%'}}><Typography variant='h6' color={props.darkTheme?'white':'#124D81'} paddingLeft={'10%'} style={{fontWeight: 'bold', fontFamily: 'Helvetica'}}>Baby Temp</Typography>
              
              </div>
                                {/* <Typography variant='subtitle2' color={"#A8C5D4"} marginTop={'10px'} paddingTop={'4%'}>Heater Temp %</Typography> */}
                                <div style={{display:'flex', textAlign:'center', justifyContent:'center'}}>
                                   
                                    <Typography variant='h1' color={props.darkTheme?'white':'#124D81'} >
                                    {(() => {
                                                      let data = finddata("Measured Skin Temp 1")
                                                      return (data!.data)
                                              })()}
                                    </Typography>
                                    <Typography variant='subtitle1'  color={props.darkTheme?'white':'#124D81'}  >
                                    ℃
                                    </Typography>
                                    <Typography variant='subtitle1'color={props.darkTheme?'white':'#124D81'} paddingTop={'25%'} >
                                    {(() => {
                                                      let data = finddata("Set Skin Temp")
                                                      return (data!.data)
                                              })()}
                                    </Typography>
                                </div>
              </Box>
              <Box width={'25%'} >
              <div style={{marginTop:'15%'}}><Typography variant='subtitle1'  color={props.darkTheme?'white':'#4B7193'} style={{fontWeight: 'bold', fontFamily: 'Helvetica'}} >Heater Temp</Typography></div>
                                {/* <Typography variant='subtitle2' color={"#A8C5D4"} marginTop={'10px'} paddingTop={'4%'}>Heater Temp %</Typography> */}
                                <div style={{display:'flex', textAlign:'center', justifyContent:'center'}}>
                                  <Typography variant='h2' color={props.darkTheme?'white':'#4B7193'} >
                                  {(() => {
                                                      let data = finddata("Heater Level")
                                                      return (data!.data)
                                              })()}
                                    </Typography>
                                    <Typography variant='subtitle1' color={props.darkTheme?'white':'#4B7193'} paddingTop={'13%'} paddingLeft={'3%'}>
                                       %
                                    </Typography>
                                </div>
              </Box>
              
              <Box width={'25%'} > <div style={{marginTop:'15%'}}><Typography variant='subtitle1' style={{fontWeight: 'bold', fontFamily: 'Helvetica'}}  color={props.darkTheme?'white':'#124D81'}  paddingLeft={'20%'}>Alarm <FontAwesomeIcon icon={faBell }  color={props.darkTheme?'white':'#124D81'}/></Typography>
              </div>
                                {/* <Typography variant='subtitle2' color={"#A8C5D4"} marginTop={'10px'} paddingTop={'4%'}>Heater Temp %</Typography> */}
                                <div style={{display:'flex', textAlign:'center', justifyContent:'center'}}>
                                   
                                <Typography  variant='subtitle1' color={`${alarmColor}`} paddingTop={'10%'} >
                                                      {displayAlarm}
                                                  </Typography>
                                    
                                </div>
                                </Box>
              </Stack>
              
              
              <Stack height={'50%'} width={'100%'} marginTop={'5%'} direction={'row'}>
              <Box width={'25%'} ><div style={{marginTop:'7%'}}><Typography variant='subtitle1' color={props.darkTheme?'white':'#3C89C0'}  style={{fontWeight: 'bold', fontFamily: 'Helvetica'}}  paddingLeft={'10%'}>Heart Rate</Typography></div>
                                {/* <Typography variant='subtitle2' color={"#A8C5D4"} marginTop={'10px'} paddingTop={'4%'}>Heater Temp %</Typography> */}
                                <div style={{display:'flex', textAlign:'center',paddingLeft:'8%', justifyContent:'left'}}>
                                   
                                   <Typography variant='h4' color={props.darkTheme?'white':'#3C89C0'}  >
                                   {(() => {
                                                      let data = finddata("Pulse Rate")
                                                      return (data!.data)
                                              })()}
                                   </Typography>
                                   <Typography variant='subtitle2'  color={props.darkTheme?'white':'#3C89C0'}  paddingTop={'15%'} paddingLeft={'3%'}>
                                     BPM
                                   </Typography>
                               </div></Box>
              <Box width={'25%'} ><div style={{marginTop:'7%'}}><Typography variant='subtitle1'  color={props.darkTheme?'white':'#3C89C0'} style={{fontWeight: 'bold', fontFamily: 'Helvetica'}} paddingLeft={'10%'}>Spo2</Typography></div>
                                {/* <Typography variant='subtitle2' color={"#A8C5D4"} marginTop={'10px'} paddingTop={'4%'}>Heater Temp %</Typography> */}
                                <div style={{display:'flex', textAlign:'center', paddingLeft:'6%', justifyContent:'left'}}>
                                   
                                   <Typography variant='h4'  color={props.darkTheme?'white':'#3C89C0'}   >
                                   {(() => {
                                                      let data = finddata("SpO2")
                                                      return (data!.data)
                                              })()}
                                   </Typography>
                                   <Typography variant='subtitle2'  color={props.darkTheme?'white':'#3C89C0'}  paddingTop={'15%'} paddingLeft={'3%'}>
                                     %
                                   </Typography>
                               </div></Box>
              <Box width={'25%'} ><div style={{marginTop:'7%'}}><Typography variant='subtitle2'   color={props.darkTheme?'white':'#3C89C0'}  style={{fontWeight: 'bold', fontFamily: 'Helvetica'}} paddingLeft={'10%'}>PI</Typography></div>
                                {/* <Typography variant='subtitle2' color={"#A8C5D4"} marginTop={'10px'} paddingTop={'4%'}>Heater Temp %</Typography> */}
                                <div style={{display:'flex', textAlign:'center', paddingLeft:'6%', justifyContent:'left'}}>
                                   
                                   <Typography variant='h4'  color={props.darkTheme?'white':'#3C89C0'} >
                                   {(() => {
                                                      let data = finddata("PI")
                                                      return (data!.data)
                                              })()}
                                   </Typography>
                                   <Typography variant='subtitle2'  color={props.darkTheme?'white':'#3C89C0'}  paddingTop={'15%'} paddingLeft={'3%'}>
                                     BPM
                                   </Typography>
                               </div></Box>
              <Box width={'25%'} ><div style={{marginTop:'7%'}}><Typography variant='subtitle2'  color={props.darkTheme?'white':'#38AAC3'}    style={{fontWeight: 'bold', fontFamily: 'Helvetica'}}  paddingLeft={'10%'}>Weight</Typography></div>
                                {/* <Typography variant='subtitle2' color={"#A8C5D4"} marginTop={'10px'} paddingTop={'4%'}>Heater Temp %</Typography> */}
                                <div style={{display:'flex', textAlign:'center', paddingLeft:'6%', justifyContent:'left'}}>
                                   
                                   <Typography variant='h4'color={props.darkTheme?'white':'#38AAC3'} >
                                   {(() => {
                                                      let data = finddata("Weight")
                                                      return (data!.data)
                                              })()}
                                   </Typography>
                                   <Typography variant='subtitle1'color={props.darkTheme?'white':'#38AAC3'} paddingTop={'10%'} paddingLeft={'3%'}>
                                     KG
                                   </Typography>
                               </div></Box>
              </Stack>
                    </Stack>
                    ):(
                        <Stack height={'100%'} width={'100%'} borderTop={'1px solid grey'} >
                            <Stack height={'50%'} width={'100%'} borderBottom={'1px solid grey'} justifyContent={'center'} textAlign={'center'}>
                                <Typography variant='caption' color={props.darkTheme?'white':'#124D81'}  paddingTop={'5%'}  >
                                    Devices Connected  
                                </Typography>
                                <Box gap={'3px'} width={'95%'} height={'50%'} marginLeft={'auto'} marginRight={'auto'} marginBottom={'auto'} marginTop={'auto'} display={'flex'} flexWrap={'wrap'}>
                                    {getDevices()}
                                </Box>
                                
                            </Stack>
                            <Stack height={'50%'} width={'100%'} direction={'row'} textAlign={'center'} justifyContent={'center'}>
                                <Typography variant='caption' color={props.darkTheme?'white':'#124D81'}    paddingTop={'9%'} >
                                    No Therapy Running
                                </Typography>
                            </Stack>
                            
                        </Stack>
                    )}
                    
                    
                </Stack>

            </Card>
            <NewPatientDetails 
                isDialogOpened={isOpen}
                handleCloseDialog={() => { setIsOpen(false); } }
                observation_resource={props.observation_resource}
                communication_resource={props.communication_resource}
                device={props.device}
                patient_id={props.patient_id}
                patient_name={props.patient_name}
                newData={newData}
                key={props.patient_resource_id}
                patient_resource_id={props.patient_resource_id} 
                darkTheme={props.darkTheme} />
                
        </Box>
    )
}


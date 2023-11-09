// import { AccountCircle } from '@mui/icons-material'
import { Box, Card, Stack, Typography, ButtonBase  } from '@mui/material'
// import { red } from '@mui/material/colors'
import { FC, useEffect, useState } from 'react'
// import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faBell, faPowerOff,faTemperatureArrowDown, faTemperatureArrowUp} from '@fortawesome/free-solid-svg-icons'
import { NewDeviceDetails } from './NewDeviceDetails';

export interface DeviceDetails {
  key: string;
  device_id: string;
  patient: {
    "resourceType": string;
    "id": string;
    "meta": {
        "versionId": string;
        "lastUpdated": string;
    };
    "extension": 
        {
            "url": string;
            "valueString":string;
        }[];

    "identifier": 
        {
            "system": string;
            "value": string;
        }[];
    
} | null;
  device_resource_id: string;
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
  };
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
  };
}

export const BrammiCard: FC<DeviceDetails> = (props): JSX.Element => {
    const [isOpen, setIsOpen] = useState(false);
    const [alarmColor, setAlarmColor] = useState("#202020")
    // const devicetimer = setInterval(timer, 10000)



    // const devicetimer = setInterval(timer, 10000)

    // setInterval(secondTimer,7000)
    const [newData, setNewData] = useState(false);
    const [alarm, setAlarm] = useState("")
    const [runNo, setRunNo] = useState(0)

    // function secondTimer() {
        
    // }
    const [requiredForTimer, setRequiredForTimer] = useState(false)

    const [requiredForBorderColor, setRequiredForBorderColor] = useState(false)
    
    const [isBlinking, setIsBlinking] = useState(false);

    useEffect(() => {
    setRunNo(runNo+1)
    if (props.observation_resource?.component?.[1] && runNo>=2 && props.communication_resource?.extension?.[1]) {
        setNewData(true);
        setRequiredForBorderColor(!requiredForBorderColor)
        for (var i=0; i< props?.communication_resource?.extension?.[1].valueCodeableConcept?.coding?.length; i++){
        console.log(props.communication_resource?.extension[1]?.valueCodeableConcept?.coding[i]?.code)
        if(props.communication_resource?.extension[1]?.valueCodeableConcept?.coding[i]?.code=='High Priority'){
            setAlarmColor('red')
            setAlarm(props.communication_resource.extension[0].valueCodeableConcept.coding[i].display)
            break
        }else{
            setAlarmColor('yellow')
            setAlarm(props.communication_resource.extension[0].valueCodeableConcept.coding[i].display)
        }
    }
    setRequiredForTimer(!requiredForTimer)
    }
    console.log("New call")
    }, [props.observation_resource]);

    function findData(x: string){
        let index = props?.observation_resource?.component.findIndex(item => item.code.text===x)
        if(index==-1){
            return({data: "--", unit: "--"})
        }
        let data = Number(props.observation_resource.component[index].valueQuantity.value)
        data = Math.round((data + Number.EPSILON) * 100) / 100
        let unit = props.observation_resource.component[index].valueQuantity.unit
        return ({data:data, unit:unit})
    }

    useEffect(() => {
     let intervalId: number | undefined;
 
     if (newData) {
       intervalId = setInterval(() => {
         setIsBlinking((prevIsBlinking) => !prevIsBlinking);
       }, 300); // Adjust the blinking interval (in milliseconds) as needed
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
    // function timer() {
    //     // if((tempColor!=alarmColor) && (newData==true)){
    //     //     const x = alarmColor
    //     //     setAlarmColor(tempColor)
    //     //     setTempColor(x)
    //     // }
    //     console.log(newData)
    // }

    // const tick =setInterval(timer,1000)
//   useEffect(() => {console.log(props.patient_id)},[props.patient_id])
const [controlOpacity, setControlOpacity] = useState("0.8")
  return (

      <Box  width={{
        xs: "350px",
        sm: "500px",
        md: "500px",
        lg: "500px"
      }} sx={{ borderRadius:'25px', cursor:'pointer'}}  //border: alarmColor!='transparent' ? `6px solid ${alarmColor}`: "", opacity:controlOpacity, boxShadow: '0px 0px 5px 5px white'
      onMouseLeave={() => {setControlOpacity("0.8")}} onMouseEnter={() => {setControlOpacity("1")}} onClick={() => {console.log(props.communication_resource.id);setIsOpen(true)}}
      >
        <ButtonBase sx={{width:'100%', borderRadius:'25px'}}>
        {/* <Link to="devicedata" style={{ textDecoration: 'none' }} state={{device_id: props.device_id, device_resource_id: props.device_resource_id, patient: props.patient, observation_resource: props.observation_resource, communication_resource: props.communication_resource, key: props.device_resource_id}}> */}
        
          <Card
            style={{width:'100%', backgroundImage:'linear-gradient(to bottom, #34405D, #151E2F, #34405D)', borderRadius: "25px", height:"300px", opacity:controlOpacity, boxShadow: `0px 0px 30px 5px ${isBlinking ? alarmColor: '#202020'}`, border:'1px solid #606060'
        }}
          >
            {newData ? (<>
                <Stack width={'100%'} height={'100%'}>
                    
                <Box display={'flex'} width={'100%'} height={'10%'} paddingTop={'2.5%'}>
                        <Box width={'30%'} height={'100%'} textAlign={'left'} paddingLeft={'5%'} >
                        <Typography variant="subtitle2" sx={{fontWeight:"bold", marginLeft:'5px'}} color={'#CBCFE5'}>
                                    {props.patient?.identifier && props?.patient?.identifier[0]?.value}
                                    </Typography>
                        </Box>
                        <Box width={'40%'} height={'100%'} textAlign={'center'}>
                            <div style={{fontSize: '100%', paddingRight:'3%' , fontWeight:500}} >
                                {(() => {
                                    let data = findData("MODE")
                                    return (data.unit+" "+"MODE")
                                })()}
                            </div>
                            
                        </Box> 
                        {/* <FontAwesomeIcon icon={faPersonBreastfeeding} fontSize={'250%'} color='#CBCFE5'/> */}
                        <Box display={'flex'} width={'30%'} height={'100%'}>
                            
                            <Box paddingRight={'2%'} width={'100%'} height={'65%'} sx={{backgroundColor:'transparent'}}>
                                
                                    <Typography variant="subtitle2"  color={'#CBCFE5'}>
                                        {props?.device_id}
                                    </Typography>
                                
                            </Box>
                        </Box>                         
                    </Box>
                    <Stack width={"100%"} height={'50%'} direction={'row'}>
                        <Box width={'33.33%'} height={'100%'} sx={{ borderRight:'2px solid grey', borderTop:'2px solid grey'}} justifyContent={'center'} textAlign={'center'}>
                            <div style={{marginTop:'7%'}}><Typography variant='caption' color={"#A8C5D4"}>Rectal Probe</Typography></div>
                            {/* <Typography variant='subtitle2' color={"#A8C5D4"} marginTop={'10px'} paddingTop={'4%'}>Heater Temp %</Typography> */}
                            <div style={{display:'flex', textAlign:'center', justifyContent:'center'}}>
                               
                                <Typography variant='h3'>
                                    {(() => {
                                        let data = findData("Rectal Measure Temp")
                                        return (data.data)
                                    })()}
                                </Typography>
                                <Typography variant='subtitle2' color={"#5db673"} paddingTop={'13%'} paddingLeft={'3%'}>
                                    {(() => {
                                        if(props.observation_resource?.component[0].valueQuantity.unit=="MANUAL"){
                                            let data = findData("Set Temp")
                                            return (data.data)
                                        }
                                        else{return ""}
                                    })()}
                                </Typography>
                            </div>
                        </Box>
                        <Box width={'33.33%'} height={'100%'} sx={{ borderRight:'2px solid grey', borderTop:'2px solid grey'}} justifyContent={'center'} textAlign={'center'}>
                        <div style={{marginTop:'7%'}}><Typography variant='caption' color={"#A8C5D4"}>Skin Temp</Typography></div>
                            <div style={{display:'flex', textAlign:'center', justifyContent:'center'}}>
                            {/* <FontAwesomeIcon icon={faBaby} color='#CBCFE5' style={{paddingTop:'6%', paddingRight:'7%', fontSize:'200%'}}/> */}
                                <Typography variant='h3'>
                                    {(() => {
                                        let data = findData("Skin Measure Temp")
                                    
                                        return (data.data)
                                    })()}
                                </Typography>
                                <Typography variant='h6' color={"#5db673"} paddingTop={'13%'} paddingLeft={'3%'}>
                                    {(() => {
                                        if(props.observation_resource?.component[0].valueQuantity.unit=="BABY"){
                                            let data = findData("Set Skin Temp 1")
                                            return (data.data)
                                        }
                                        else{return ""}
                                    })()}
                                </Typography>
                            </div>
                            <Typography variant='h6' color={"#5db673"} paddingLeft={'3%'}>
                                {(() => {
                                        let data = findData("Measured Skin Temp 2")
                                        return (data.data)
                                    }
                                )()}
                            </Typography>
                        </Box>
                        <Box width={'33.33%'} height={'100%'} sx={{ borderTop:'2px solid grey'}} justifyContent={'center'} textAlign={'center'}>
                        <div style={{marginTop:'7%'}}><Typography variant='caption' color={"#A8C5D4"}>Mattress Temp</Typography></div>
                            <div style={{display:'flex', textAlign:'center', justifyContent:'center'}}>
                            {/* <FontAwesomeIcon icon={faBaby} color='#CBCFE5' style={{paddingTop:'6%', paddingRight:'7%', fontSize:'200%'}}/> */}
                                <Typography variant='h3'>
                                    {(() => {
                                        let data = findData("Mattress Measure Temp")
                                        return (data.data)
                                    })()}
                                </Typography>
                                <Typography variant='h6' color={"#5db673"} paddingTop={'13%'} paddingLeft={'3%'}>
                                    {(() => {
                                        if(props.observation_resource?.component[0].valueQuantity.unit=="BABY"){
                                            let data = findData("Set Skin Temp 1")
                                            return (data.data)
                                        }
                                        else{return ""}
                                    })()}
                                </Typography>
                            </div>
                            <Typography variant='h6' color={"#5db673"} paddingLeft={'3%'}>
                                {(() => {
                                        let data = findData("Measured Skin Temp 2")
                                        return (data.data)
                                    }
                                )()}
                            </Typography>
                        </Box>
                    </Stack>
                    <Stack width={"100%"} height={'50%'} direction={'row'} >
                        <Box width={'33.33%'} height={'100%'} sx={{ borderRight:'2px solid grey', borderTop:'2px solid grey'}} justifyContent={'center'} textAlign={'center'}>
                        <Box marginTop={'5%'}><Typography variant='caption' color={"#A8C5D4"}  paddingTop={'7%'} paddingRight={'10px'} >
                                Alarm  
                                </Typography>
                                <FontAwesomeIcon icon={faBell} /></Box>
                           
                            <Typography  variant='subtitle1' color={`${alarmColor}`} >
                                
                                {alarm}
                                
                            </Typography>
                            
                        </Box>
                        <Box width={'33.33%'} height={'100%'} sx={{ borderRight:'2px solid grey', borderTop:'2px solid grey'}}></Box>
                        <Box width={'33.33%'} height={'100%'}sx={{ borderTop:'2px solid grey'}}>
                        {/* <Typography variant='caption' color={"#A8C5D4"}  paddingTop={'7%'} paddingLeft={'5%'}>Mode</Typography> */}
                        <FontAwesomeIcon icon={faTemperatureArrowDown}  style={{paddingTop:'20%', paddingRight:'7%', fontSize:'300%'}} />
                        <FontAwesomeIcon icon={faTemperatureArrowUp}  style={{paddingTop:'20%', paddingRight:'7%', fontSize:'300%'}} />
                            {/* <Box display={'flex'} width={'100%'} height={'33%'} sx={{ borderTop:'2px solid grey'}} justifyContent={'space-between'} textAlign={'center'}>
                                
                                <Typography variant='caption' color={"#A8C5D4"}  paddingTop={'7%'} paddingLeft={'5%'}>PVI</Typography>
                                <Typography variant='h6' color={"#5db673"} paddingTop={'2%'} paddingRight={'5%'}>
                                    {(() => {
                                            let data = findData("PVI")
                                            return (data.data)
                                        }
                                    )()}
                                </Typography>
                            </Box> */}
                           
                        </Box>
                    </Stack>
                    
                </Stack>
            </>):(<>
            <Box width={'100%'} height={'100%'} sx={{backgroundColor:'transparent'}} display={'flex'} textAlign={"center"} justifyContent={"center"}>
            <Stack width={'100%'} height={'100%'} justifyContent={"center"} textAlign={"center"}>
                    <FontAwesomeIcon icon={faPowerOff} style={{fontSize: 70, color:'white', marginLeft:'auto', marginRight:'auto', fontWeight:'lighter', paddingBottom:'3%'}} />
                    <Typography variant='subtitle1' sx={{marginLeft:'auto', marginRight:'auto',  color:'grey'}}>{props?.device_id}</Typography>
                    <Typography variant='subtitle1' sx={{marginLeft:'auto', marginRight:'auto',  color:'grey'}}>Not Active/Connected</Typography>
            </Stack>
            </Box>
                
            </>)}
            

          </Card>
          </ButtonBase>
        {/* </Link> */}
        <NewDeviceDetails 
        isDialogOpened={isOpen} 
        handleCloseDialog={() => {console.log("MY BOI");setIsOpen(false)}}
        observation_resource={props.observation_resource}
        communication_resource={props.communication_resource}
        device_id={props.device_id}
        device_resource_id={props.device_resource_id}
        patient={props.patient}
        newData={newData}
        />

        
      </Box>
  )
}

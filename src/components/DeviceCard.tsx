// import { AccountCircle } from '@mui/icons-material'
import { Box, Paper, Card, CardContent, Stack, Typography,  } from '@mui/material'
// import { red } from '@mui/material/colors'
import { FC, useEffect, useState } from 'react'
// import { Link } from 'react-router-dom'
import { Divider } from '@mui/material';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';

export interface DeviceDetails {
  key: string;
  device_id: string;
  patient_id: string;
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
                "coding": string[];
            };
        }[];
  };

}

export const DeviceCard: FC<DeviceDetails> = (props): JSX.Element => {

  
  useEffect(() => {console.log(props.observation_resource)},[props.observation_resource])
  const [newData, setNewData] = useState(false);
  useEffect(() => {
    if (props.patient_id !== "" && props.observation_resource.component[1]) {
      setNewData(true);
    }
  }, [props.patient_id, props.observation_resource]);
  
//   const [valueQuantityValue, setvalueQuantityValue] = useState(Number)
  // useEffect(() => {
  //   if(total==3){
  //     setNewData(false)
  //   }
  // },[total])
  // useEffect(() => {
  // }, [observation])

  

  return (
    
      <Box  width={"350px"} sx={{backgroundColor:'transparent'}}>
        <Paper  elevation={2} sx={{ borderRadius: "25px", backgroundColor:'transparent'}}>
          <Card
            style={{ backgroundColor: "transparent", borderRadius: "25px", minHeight:"280px"
             }}
          >
              <div>
                <CardContent>
                  <Stack
                    direction={{ xs: "row" }}
                    spacing={{ xs: 1, md: 1.5 }}
                    useFlexGap
                    flexWrap={"wrap"}
                  >
                    <Stack direction={'row'} width={"100%"}>
                      <Typography variant="subtitle1" component={"h2"}>
                      {props.device_id}
                      </Typography>
                      <Typography variant="subtitle1" sx={{marginLeft:'auto'}}>
                      {props.patient_id}
                      </Typography>
                    </Stack>
                    
                  </Stack>
                  <Divider />
                  { newData ? (<>
                    <Stack  marginTop={'10px'} marginBottom={'10px'}>
                      <Stack direction={'row'} width={"100%"} >
                          <Stack direction={'row'} width={'50%'} >
                              <Typography variant='subtitle1' component={"h2"}>
                                  Set Temp:&nbsp;
                              </Typography>
                              <Typography variant='h5' component={"h2"} sx={{marginLeft:'auto'}} paddingRight={'20px'}>
                                  100
                              </Typography>
                          </Stack>
                          <Stack direction={'row'}  width={'50%'}>
                              <Typography variant='subtitle1' component={"h2"}>
                                  Mes. Temp:&nbsp;
                              </Typography>
                              <Typography variant='h5' component={"h2"} sx={{marginLeft:'auto'}}>
                                  100   
                              </Typography>
                          </Stack>
                      </Stack>
                      <Stack direction={'row'} width={"100%"} marginTop={'10px'}>
                          <Stack direction={'row'}  width={'50%'}>
                              <Typography variant='subtitle1' component={"h2"}>
                                  Heater %:&nbsp;
                              </Typography>
                              <Typography variant='h5' component={"h2"} sx={{marginLeft:'auto'}} paddingRight={'20px'}>
                                  100   
                              </Typography>
                          </Stack>
                          <Stack direction={'row'}  width={'50%'}>
                              <Typography variant='subtitle1' component={"h2"}>
                                  Air Temp:&nbsp;
                              </Typography>
                              <Typography variant='h5' component={"h2"} sx={{marginLeft:'auto'}} >
                                  100   
                              </Typography>
                          </Stack>
                      </Stack>
                  </Stack>
                  <Divider />
                  <Stack  marginTop={'10px'} marginBottom={'10px'}>
                      <Stack direction={'row'} width={"100%"} >
                          <Stack direction={'row'} width={'50%'} >
                              <Typography variant='subtitle1' component={"h2"}>
                                  {props.observation_resource.component[0].code.text}:&nbsp;
                              </Typography>
                              <Typography variant='h5' component={"h2"} sx={{marginLeft:'auto'}} paddingRight={'20px'}>
                                  {props.observation_resource.component[0].valueQuantity.value}{props.observation_resource.component[0].valueQuantity.unit}
                              </Typography>
                          </Stack>
                          <Stack direction={'row'}  width={'50%'}>
                              {/* <Typography variant='subtitle1' component={"h2"}>
                                  PI:&nbsp;
                              </Typography>
                              <Typography variant='h5' component={"h2"} sx={{marginLeft:'auto'}} >
                                  100   
                              </Typography> */}
                              <Typography variant='subtitle1' component={"h2"}>
                                  {props.observation_resource.component[1].code.text}:&nbsp;
                              </Typography>
                              <Typography variant='h5' component={"h2"} sx={{marginLeft:'auto'}} paddingRight={'20px'}>
                                  {props.observation_resource.component[1].valueQuantity.value}{props.observation_resource.component[1].valueQuantity.unit}
                              </Typography>
                          </Stack>
                      </Stack>
                      <Stack direction={'row'} width={"100%"} marginTop={'10px'}>
                          <Stack direction={'row'}  width={'50%'}>
                              {/* <Typography variant='subtitle1' component={"h2"}>
                                  PR:&nbsp;
                              </Typography>
                              <Typography variant='h5' component={"h2"} sx={{marginLeft:'auto'}} paddingRight={'20px'}>
                                  100   
                              </Typography> */}
                              <Typography variant='subtitle1' component={"h2"}>
                                  {props.observation_resource.component[2].code.text}:&nbsp;
                              </Typography>
                              <Typography variant='h5' component={"h2"} sx={{marginLeft:'auto'}} paddingRight={'20px'}>
                                  {props.observation_resource.component[2].valueQuantity.value}{props.observation_resource.component[2].valueQuantity.unit}
                              </Typography>
                          </Stack>
                          <Stack direction={'row'}  width={'50%'}>
                              {/* <Typography variant='subtitle1' component={"h2"}>
                                  SIQ:&nbsp;
                              </Typography>
                              <Typography variant='h5' component={"h2"} sx={{marginLeft:'auto'}} >
                                  100   
                              </Typography> */}
                              <Typography variant='subtitle1' component={"h2"}>
                                  {props.observation_resource.component[3].code.text}:&nbsp;
                              </Typography>
                              <Typography variant='h5' component={"h2"} sx={{marginLeft:'auto'}} paddingRight={'20px'}>
                                  {props.observation_resource.component[3].valueQuantity.value}{props.observation_resource.component[3].valueQuantity.unit}
                              </Typography>
                          </Stack>
                      </Stack>
                  </Stack>
                  <Divider /></>) : (
                  <div style={{marginLeft:'85px', marginTop:'5px'}}>
                    <PowerSettingsNewIcon sx={{ fontSize: 150, color:'red' }} />
                    <br></br>
                    <Typography variant='h6'>Device not active</Typography>
                  </div>) }
                  
                  {/* <Stack
                    direction={{ xs: "row" }}
                    spacing={{ xs: 1, sm: 1, md: 1.5 }}
                    useFlexGap
                    flexWrap={"wrap"}
                  >
                    <Stack sx={{ margin: 2, mt: 2.5 }}>
                      <Typography variant="body1" component={"span"}>
                        D.O.A
                      </Typography>
                      <Typography
                        variant="body2"
                        component={"span"}
                        color={"text.secondary"}
                      >
                        HELLO WORLD
                      </Typography>
                    </Stack>
                    <Stack sx={{ margin: 2, marginLeft: 11, mt: 2.5 }}>
                      <Typography variant="body1" component={"span"}>
                        Weight
                      </Typography>
                      <Typography
                        variant="body2"
                        component={"span"}
                        color={"text.secondary"}
                      >
                        HELLO WORLD
                      </Typography>
                    </Stack>
                  </Stack> */}
                </CardContent>
              </div>
            
          </Card>
        </Paper>
        
      </Box>
  )
}
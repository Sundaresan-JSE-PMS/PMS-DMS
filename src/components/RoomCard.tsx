import { Alert, Button, Dialog, DialogActions,Menu, DialogContent, DialogContentText, DialogTitle,  List, ListItem, ListItemButton, Select, Snackbar, Stack, Typography, MenuItem,} from '@mui/material'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Paper from '@mui/material/Paper'
import { FC, useEffect, useState } from 'react'
import SettingsIcon from '@mui/icons-material/Settings';
import IconButton from '@mui/material/IconButton';

export interface roomData {
    roomName: string;
    roomId: string;
}
export const RoomCard: FC<roomData> = (props): JSX.Element => {
    const [snackSucc, setSnackSucc] = useState(false);
    const [snack, setSnack] = useState(false)

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        // console.log(event)
        if (reason === 'clickaway') {
          return;
        }
    
        setSnack(false);
      };
    
    const [deviceList, setDeviceList] = useState([{
        resource: {
            "resourceType": String,
            "id": String,
            "meta": {
                "versionId": String,
                "lastUpdated": String
            },
            "identifier": [
                {
                    "system": String,
                    "value": String
                },{
                    "system": String,
                    "value": String
                }
            ],
            "status": String,
            "manufacturer": String,
            "patient": {
                "reference": String
            },
            "location": {
                "reference": ""
            }
        }
    }])

    const [open, setOpen] = useState(false);
    // const [deviceInRoom, setDeviceInRoom] = useState([{
    //     resource: {
    //         "resourceType": String,
    //         "id": String,
    //         "meta": {
    //             "versionId": String,
    //             "lastUpdated": String
    //         },
    //         "identifier": [
    //             {
    //                 "system": String,
    //                 "value": String
    //             }
    //         ],
    //         "status": String,
    //         "manufacturer": String,
    //         "patient": {
    //             "reference": String
    //         },
    //         "location": {
    //             "reference": String
    //         }
    //     }
    // }])
    // const devicesInRoom = () => {
    //     let url = `http://13.126.5.10:9444/fhir-server/api/v4/Device/?location=${props.roomId}`
    //     console.log(url)
    //     fetch(url, {
    //         credentials: "omit", // send cookies and HTTP authentication information
    //         headers: {
    //             Authorization: "Basic " + btoa("fhiruser:change-password"), // set HTTP basic auth header
    //         },
    //     })
    //     .then((response) => {
    //         response.json()
    //         // console.log(response.json())
    //     })
    //     .then((data) => {
    //         console.log(data)
    //         // if(data.entry){setDeviceInRoom(data.entry)}
    //     })

    //     return (
    //         // <List>
    //             deviceInRoom.map((device) => {
    //                 return (
    //                     <div>{device.resource.identifier[0].value}</div>
    //                 )
    //             })
    //         // </List>
    //     )
    // }
    // const [X, setX] = useState(false)
    // SettingsIcon  onClick={() => {setX(true); setDeleteRoom(false)}}
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const handleClose1 = () => {
        setAnchorEl(null);
      };
      const open1 = Boolean(anchorEl);
      const handleClick1 = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
      };



    const addButton = (index: any) => {
        let data = {}
        let vvtemp = {"reference": `Location/${props.roomId}`}
        data = {
            ...deviceList[Number(index)].resource,
            location: vvtemp
        }
        //console.log(`http://13.126.5.10:9444/fhir-server/api/v4/Device/${deviceList[Number(index)].resource.id}`)

        fetch(`http://13.126.5.10:9444/fhir-server/api/v4/Device/${deviceList[Number(index)].resource.id}?_count=20`, {
            credentials: "omit", // send cookies and HTTP authentication information
            method: "PUT",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                Authorization: "Basic " + btoa("fhiruser:change-password"), // set HTTP basic auth header
            },
        })
        .then((response) => {
            setSnack(true)
            if(response.status==200){setSnackSucc(true)}
            else{setSnackSucc(false)}
        })
    }
    const removeButton = (index: any) => {
        let data = {}
        // let vvtemp = {"reference": `Location/${props.roomId}`}
        data = {
            ...deviceList[Number(index)].resource,
        }
        delete data.location;
        //console.log(`http://13.126.5.10:9444/fhir-server/api/v4/Device/${deviceList[Number(index)].resource.id}`)

        fetch(`http://13.126.5.10:9444/fhir-server/api/v4/Device/${deviceList[Number(index)].resource.id}`, {
            credentials: "omit", // send cookies and HTTP authentication information
            method: "PUT",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                Authorization: "Basic " + btoa("fhiruser:change-password"), // set HTTP basic auth header
            },
        })
        .then((response) => {
            setSnack(true)
            if(response.status==200){setSnackSucc(true)}
            else{setSnackSucc(false)}
        })
    }
    const [deleteDevice, setDeleteDevice] = useState(false)
    const [deleteRoom, setDeleteRoom] = useState(false)
    const removeRoomButton = () => {
        console.log("Called")
        fetch(`http://13.126.5.10:9444/fhir-server/api/v4/Location/${props.roomId}`, {
            credentials: "omit", // send cookies and HTTP authentication information
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Basic " + btoa("fhiruser:change-password"), // set HTTP basic auth header
            },
        })
        .then((response) => {
            console.log(response.status)
            setSnack(true)
        
            if(response.status==200){setSnackSucc(true)}
            else{setSnackSucc(false)}
        })
        .then((data) => {console.log(data)})
    }
    const removeRoom = () => {

        return (
            <Dialog
            open={deleteRoom}
            onClose={() => setDeleteDevice(false)}
            aria-labelledby="responsive-dialog-title"
            
        >
            <DialogTitle id="responsive-dialog-title">
            {`Remove ${props.roomName}?`}
            
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                Are you sure you want to remove {props.roomName}?
            </DialogContentText>
            
            </DialogContent>
            <DialogActions>
            <DialogActions>
                <Button autoFocus onClick={() => {removeRoomButton(); setDeleteRoom(false)}}>
                    Yes, I am
                </Button>
                <Button onClick={() => {setDeleteRoom(false)}} autoFocus>
                    No
                </Button>
                </DialogActions>
            </DialogActions>
        </Dialog>
        
        )
    }

    const removeFromRoom = () => {
        useEffect(() =>{
            fetch(`http://13.126.5.10:9444/fhir-server/api/v4/Device/${props.roomId}`, {
          credentials: "omit",
          headers: {
            Authorization: "Basic "+ btoa("fhiruser:change-password"),
          },
        })
        .then((response) => response.json())
        .then((data) => {if(data.entry){
          console.log(data.entry)
          setDeviceList(data.entry)
        }})
        }, [])
        return (
            <Dialog
            open={deleteDevice}
            onClose={() => setDeleteDevice(false)}
            aria-labelledby="responsive-dialog-title"
            
        >
            <DialogTitle id="responsive-dialog-title">
            {`Remove device from ${props.roomName}`}
            
            </DialogTitle>
            <DialogContent>
            <List>
                {deviceList.map((device, index) => {
                        if(device?.resource?.location?.reference.split("/")[1] == props.roomId){
                            return(
                                <ListItem>
                                    <ListItemButton onClick={() => removeButton((index))}>
                                    
                                    <Typography variant="subtitle1" component={"h2"} sx={{marginRight:'auto', marginTop:'auto', marginBottom:'auto'}}>
                                    {(device.resource.identifier[0].value).toString()}
                                    </Typography>
                                    </ListItemButton>
                                </ListItem>
                            )
                        }
                    
                })}
            </List>
            </DialogContent>
            <DialogActions>
            <Button onClick={(() => {setDeleteDevice(false)})}>
                Close
            </Button>
            </DialogActions>
        </Dialog>
        
        )
    }

    const addToRoom = () => {
        
        // let deviceList: any[] = []
        useEffect(() =>{
            fetch(`http://13.126.5.10:9444/fhir-server/api/v4/Device?_count=20`, {
          credentials: "omit",
          headers: {
            Authorization: "Basic "+ btoa("fhiruser:change-password"),
          },
        })
        .then((response) => response.json())
        .then((data) => {if(data.entry){
          console.log(data.entry)
          setDeviceList(data.entry)
        }})
        }, [])
        
        return (
            <Dialog
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="responsive-dialog-title"
            
        >
            <DialogTitle id="responsive-dialog-title">
            {`Add device to ${props.roomName}`}
            
            </DialogTitle>
            <DialogContent>
            <List>
                {deviceList.map((device, index) => {
                        if(device?.resource?.location?.reference.split("/")[1] != props.roomId){
                            return(
                                <ListItem>
                                    <ListItemButton onClick={() => addButton((index))}>
                                    
                                    <Typography variant="subtitle1" component={"h2"} sx={{marginRight:'auto', marginTop:'auto', marginBottom:'auto'}}>
                                    {(device.resource.identifier[0].value).toString()}
                                    </Typography>
                                    </ListItemButton>
                                </ListItem>
                            )
                        }
                    
                })}
            </List>
            </DialogContent>
            <DialogActions>
            <Button onClick={(() => {setOpen(false)})}>
                Close
            </Button>
            </DialogActions>
        </Dialog>
        
        )
  }
  const [controlColor, setControlColor] = useState("grey")
  const [controlOpacity, setOpacity] = useState("0.8")
  return (
    <Box width={"350px"} sx={{ opacity:controlOpacity, backgroundColor:'transparent'}} onMouseLeave={() => {setControlColor("grey");setOpacity("0.8")}} onMouseEnter={() => {setControlColor("#2BA0E0");setOpacity("1")}} > { /* onClick={() => setOpen(true)}> */}
        <Paper  elevation={5} sx={{ borderRadius: "25px", background:'transparent'}}>
          <Card
            style={{ boxShadow:'none' ,background: "transparent", borderRadius: "25px", minHeight:"280px", border: `4px solid ${controlColor}`
             }}
          >
            <Stack width={'100%'} direction={'row'} justifyContent={'center'} textAlign={'center'}>
            <CardContent sx={{marginTop:'0%', width:'100%', justifyContent:'center', textAlign:'center'}}>
                    <Stack marginTop={'0%'}>
                   
                    <IconButton sx={{width:'10%',marginLeft:'auto',marginRight:'3%'}} onClick={handleClick1}><SettingsIcon /></IconButton>
                    <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open1}
        onClose={handleClose1}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
    
        
      >
        <Stack >
        <Button variant="contained" color='inherit' onClick={handleClose1}  >Rename</Button>
        <Button variant="contained" color='warning' onClick={handleClose1}>Delete Room</Button>
        </Stack>
        
        </Menu>


                    <Typography sx={{userSelect:"none" ,marginTop:'5%'}}>{props.roomName}</Typography>
                     </Stack>
                    <Stack spacing={"10%"} marginTop={'10%'} width={'70%'} marginLeft={'auto'} marginRight={'auto'}>
                        <Select sx={{fontSize:'10%'}  }><Button   onClick={()=> {setOpen(true)}}>Add/Move Devices</Button>
                        </Select>
                        <Button variant="outlined"  onClick={() => {setDeleteRoom(true)}} >Remove Room</Button>
                        <Button variant="outlined" color='warning' onClick={() => {setDeleteDevice(true)}}>Remove Device</Button>
                    
                    {/* <Stack direction={'row'} width={"100%"} justifyContent={'space-between'}> */}
                        
                    {/* </Stack> */}
                    
                    </Stack>
            </CardContent>
            {addToRoom()}
            {removeFromRoom()}
            {removeRoom()}
            <Snackbar open={snack} autoHideDuration={5000} onClose={handleClose}>
                    <Alert onClose={handleClose} variant="filled" severity={snackSucc ? 'success':'error'}>
                        {snackSucc && "Operation Completed Successfully"}
                        {!snackSucc && "Operation Failed"}
                    </Alert>
            </Snackbar>
            </Stack>
            
              
            
          </Card>
        </Paper>
        
      </Box>
  )
}

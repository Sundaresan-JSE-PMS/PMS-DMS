import React, { FC, useEffect, useState } from 'react';
import {AppBar, Collapse, Divider,Drawer,FormControl,IconButton,InputLabel,List,ListItem,ListItemButton,ListItemText,Menu,MenuItem,Select,SelectChangeEvent, Stack,TextField, ToggleButton, ToggleButtonGroup, useMediaQuery, useTheme} from '@mui/material';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import SettingsIcon from '@mui/icons-material/Settings';
import Button from '@mui/material/Button';
import { AccountCircle, ExpandLess, ExpandMore } from '@mui/icons-material';
import { useNavigate,useLocation } from 'react-router-dom';
import pmsLogo from '../assets/image 135.png';
import { useAuth0 } from '@auth0/auth0-react';
import { Avatar, Typography } from '@material-ui/core';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
export interface HeaderProps {
  currentRoom: string;
  roomChange: (roomId: string) => void;
  roomAltered: boolean;
  userOrganization: string;
 
}

export const Header: FC<HeaderProps> = (props) => {
  const [smallList, setSmallList] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const screenSize = useMediaQuery(theme.breakpoints.up('md'));
  const { user, isLoading, isAuthenticated, logout, getIdTokenClaims } = useAuth0();
  const[UserRole, setUserRole] = useState("");
  const[UserOrganization, setUserOrganization] = useState("");
  
  // useEffect(() => {
  //   setUserOrganization(props.userOrganization); 
  //   // Set UserOrganization from props
  // }, [props.userOrganization]);
  // console.log("hello from header",props.userOrganization)
  // getIdTokenClaims().then(res => {console.log('result',res)}).catch(err => {console.log("FAIL FUCL:"+err)})
  
  // console.log(user)
  const handleAdminClick = () => {
    navigate('/Admin');
    setNotHome(false);
    setPrevRoom(room);
  };
  const [notHome, setNotHome] = useState(true);
  const [temproom, settemproom] = useState([
    {
      resource: {
        name: '',
        resourceType: '',
        id: '',
        meta: {
          versionId: '',
          lastUpdated: '',
        },
        identifier: [
          {
            value: '',
          },
        ],
        status: '',
      },
    },
  ]);
  const [room, setRoom] = useState('');
  const [darkMode, setDarkMode] = useState(true);
  const handleSetRoom = (event: SelectChangeEvent) => {
    setRoom(event.target.value);
    props.roomChange(
      temproom[
        temproom.findIndex(
          (item) => item.resource.name.toString() === String(event.target.value)
        )
      ].resource.id
    );
  };

  const handleSetRoom2 = (value: any) => {
    console.log(value)
    setRoom(value);
    props.roomChange(
      temproom[
        temproom.findIndex(
          (item) => item.resource.name.toString() === String(value)
          // changed here (item) => item.resource.name.toString() === String(value)
        )
      ].resource.id
    );
   

  }
  const [prevRoom, setPrevRoom] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const state = Boolean(anchorEl);
  const [temp, settemp] = useState(false)
  
  const handleDMSChange = () => {
    // Handle the state change when the switch is toggled
    setDarkMode(!darkMode);
  
    // If darkMode is true, navigate to the '/' (home) route
    // If darkMode is false, navigate to the '/rooms' route
    if (darkMode) {
      navigate('/patient-monitor');
    } else {
     navigate('/device-monitor');
    }
  };

useEffect(() => {
  getIdTokenClaims()
    .then((res) => {
      console.log('Role:', res);
      setUserRole(res?.role);
      setUserOrganization(res?.organization);
       console.log("organization is here",UserOrganization )
       if (isAuthenticated) {
        // Fetch location data for the specified organization
        
        //fetch(` https://pmsind.co.in:5000/Location`, {
        fetch(` https://pmsind.co.in:5000/Location?organization=${UserOrganization}`, {
          credentials: 'omit',
          headers: {
            Authorization: 'Basic ' + btoa('fhiruser:change-password'),
          },
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.entry) {
              settemproom(data.entry);
            }
          })
          .catch((error) => {
            console.error('Failed to fetch locations:', error);
          });
      }
    })
    .catch((error) => {
      console.error('Failed to fetch role:', error);
    });
}, [isAuthenticated,UserOrganization ]);

useEffect(() => {
  // Assuming userRole is set appropriately based on your authentication logic
  if (UserRole === 'Hospital Technician' && (location.pathname === '/patient-monitor'  )) {
    // Redirect to the appropriate page if the user tries to access an unauthorized page
    navigate('/device-monitor');
  }

  if (UserRole === 'Hospital Clinician' && (location.pathname === '/rooms' || location.pathname === '/Admin'  )) {
    // Redirect to the appropriate page if the user tries to access an unauthorized page
    navigate('/device-monitor'); // You might want to redirect to another page or show an error
  }

  if (UserRole === 'Phoenix' && location.pathname !== '/organization') {
    // Redirect to the Phoenix page if the user is authenticated with the role "Phoenix"
    navigate('/organization');
  }
}, [isAuthenticated, UserRole, location.pathname, navigate]);


  // useEffect(() => {n
  //   if (isAuthenticated) {
  //     //fetch(` https://pmsind.co.in:5000/Location`, {
  //     fetch(` https://pmsind.co.in:5000/Location?organization=${UserOrganization}`, {
  //       credentials: 'omit',
  //       headers: {
  //         Authorization: 'Basic ' + btoa('fhiruser:change-password'),
  //       },
  //     })
  //       .then((response) => response.json())
  //       .then((data) => {
  //         if (data.entry) {
  //           settemproom(data.entry);
  //         }
  //       });
  //   }
  // }, [props.roomAltered, isAuthenticated,UserOrganization]); // Dependencies include props.roomAltered and isAuthenticated

  const handleBackButtonClick = () => {
    setNotHome(true)
    if(darkMode){
      navigate('/device-monitor')
    }
    else{
      navigate('/patient-monitor')
    }
    setRoom(prevRoom || props.currentRoom); // Display the previous room name if available, else the current room
  };
  const deviceModeValue = darkMode ? room : '';


  return (
    
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" style={{ background: 'transparent', boxShadow: 'none' }} sx={{ boxShadow: '0px 5px 5px 0px yellow' }}>
        <Toolbar>
          {!isLoading && isAuthenticated && (
            <>
              <div style={{ display: 'flex', marginRight: 'auto' }}>
                <Box onClick={handleBackButtonClick} sx={{ cursor: 'pointer' }}>
                  <img src={pmsLogo} alt="Phoenix" style={{ maxWidth: '90%',marginTop:'10px', height: 'auto' }} />
                  
                </Box>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Button
        size="small"
        onClick={handleMenu}
        variant="contained"
        style={{
          backgroundColor: 'white', // Set background color based on darkMode state
          color: '#124D81', // Set text color based on darkMode state
          borderRadius: '25px', // Set border radius
           // Set padding
          marginRight: '150px' // Add margin to separate from the search bar
        }}
        startIcon={<AccountCircle />}
      >
        <Typography variant="subtitle1" component="h2">
          &nbsp; {user?.name} &nbsp;
        </Typography>
      </Button>
                    <Menu
                      anchorEl={anchorEl}
                      open={state}
                      onClose={() => {
                        setAnchorEl(null);
                      }}
                      MenuListProps={{ disablePadding: true }}
                    >
                       <Box width={'350px'} height={'200px'} sx={{ backgroundColor: '#F3F2F7',color:'#124D81' }}>
                          <Stack direction={'row'} justifyContent={'space-between'}>
                            <Typography style={{ marginLeft: '5%', marginTop: '5%', marginBottom: '5%' }}>
                              Hospital Name
                            </Typography>
                            <Button  onClick={() => logout()} sx={{ height:'10%',backgroundColor: '#124D81', color: 'white', textTransform: 'capitalize' }}>
  <Typography variant="subtitle2">Sign out</Typography>
</Button>

                          </Stack>
                          <Stack direction={'row'} width={'100%'}>
                            <Avatar style={{ marginLeft: '5%', marginTop: '2%', width: 100, height: 100 }}>
                              {(() => (
                                <Typography variant="h3">{String(user?.nickname)[0].toUpperCase()}</Typography>
                              ))()}
                            </Avatar>
                            <Stack>
                              <Typography variant="h5" style={{ marginLeft: '10%', marginTop: '2%' }}>
                                {user?.nickname}
                              </Typography>
                              <Typography variant="subtitle1" style={{ marginLeft: '10%', marginTop: '2%' }}>
                                {user?.email}
                              </Typography>
                              <Typography variant="subtitle2" style={{ marginLeft: '10%', marginTop: '2%' }}>
                                Designation
                              </Typography>
                            </Stack>
                          </Stack>
                        </Box>
                    </Menu>
                   <Stack marginLeft={'150px'} sx={{backgroundColor:'#FFFFFF', borderRadius: '25px'}}> 
                   <TextField
        variant="outlined"
        size="small"
        
        inputProps={{ style: { color: '#124D81' } }} // Set text color to blue
        sx={{
          backgroundcolor:'#FFFFFF',
          '& .MuiOutlinedInput-root': {
            borderRadius: '25px', // Set border radius
            borderColor: '#F9F9F9', // Set border color
            borderStyle: 'solid', // Set border style
            borderWidth: '1px', // Set border width
            '&:hover fieldset': {
              borderColor: '#124D81' // Set border color on hover
            },
            '&.Mui-focused fieldset': {
              borderColor: '#124D81' // Set border color when focused
            }
          }
        }}
      
        placeholder="Search Baby Name/ID"
        style={{ width: '250px' }} // Adjust width as needed
      /></Stack>
                   
                </div>
              </div>
              {screenSize ? (
                <>
                  {/* Your content for larger screens */}
                  <Stack direction={'row'} justifyContent={'center'} textAlign={'center'}>
                    {notHome && UserRole === 'Hospital Technician' && (
                      <>
                        {/* <CustomSwitch onChange={handleDMSChange} checked={darkMode} /> */}
                        <Divider orientation="vertical" flexItem sx={{ marginRight: '20px', marginLeft: '20px' }} />
                        <FormControl variant="standard" sx={{ width: '200px' }}>
                          <InputLabel id="demo-simple-select-standard-label">Room</InputLabel>
                          <Select
                            label="Room"
                            onChange={handleSetRoom}
                            value={deviceModeValue}
                            MenuProps={{
                              MenuListProps: { disablePadding: true },
                              sx: {
                                '&& .Mui-selected': {
                                  backgroundColor: '#2BA0E0',
                                },
                              },
                            }}
                          >
                            {temproom.map((room) => (
                               <MenuItem
                                  key={room.resource.id}
                                  onClick={() => {
                                    setNotHome(true);
                                    if (darkMode) {
                                      // Check user role before navigating to patient-monitor
                                      if (UserRole === undefined) {
                                        // Technician should not access patient-monitor
                                        // Redirect or show an error message as needed
                                        console.log("Hospital Technicians cannot access patient-monitor");
                                      } else {
                                        navigate('/device-monitor');
                                      }
                                    } else {
                                      navigate('/device-monitor');
                                    }
                                  }}
                                  value={String(room.resource.name)}
                                  sx={{
                                    justifyContent: 'center',
                                    padding: '6%',
                                    backgroundColor: '#131726',
                                  }}
                                  // disabled={UserRole === 'Hospital Technician'}
                                >
                                  {/* {room.resource.name.toString()} */} 
                                  {room.resource.name.toString()}
                                </MenuItem>
                                
                            ))}
                            <Divider sx={{border:'1px solid grey'}} ></Divider>
              <MenuItem value="R&D"
                sx={{
                  width: '250px',padding: '6%', paddingLeft:'20px',backgroundColor: '#131726'}} onClick={() => {navigate('/rooms');setNotHome(false);setPrevRoom(room);}}>
                Rooms & Device Settings <SettingsIcon sx={{ marginLeft: 'auto' }}/>
              </MenuItem>
              <MenuItem value="R&D" sx={{width: '250px',padding: '6%',paddingLeft: '20px',backgroundColor: '#131726',}}onClick={handleAdminClick}>
      Admin Access <PersonIcon sx={{ marginLeft: 'auto' }} />
    </MenuItem>
    
                          </Select>
                          
                        </FormControl>
                      </>
                    )}
                    {notHome && UserRole === 'Hospital Clinician' && (
                      <>
                        {/* Your content for Hospital Clinician */}
                        <FormControl variant="standard" sx={{ width: '200px', backgroundColor: '#F3F2F7'}}>
                          <InputLabel id="demo-simple-select-standard-label" disabled sx={{ color: '#124D81 !important' }}>
                            Room
                          </InputLabel>
                          <Select
                            label="Room"
                            onChange={handleSetRoom}
                            value={deviceModeValue}
                            MenuProps={{
                              MenuListProps: { disablePadding: true },
                              sx: {
                                '&& .Mui-selected': {
                                  backgroundColor: '#124D81',
                                  color: '#FFFFFF',
                                },
                              },
                            }}
                            sx={{ color: '#124D81' }}
                          >
                            {temproom.map((room) => {
                              
                      return (
                        <MenuItem
                          key={room.resource.id}
                          onClick={() => {
                            setNotHome(true)
                            if(darkMode){
                              navigate('/device-monitor')
                            }
                            else{
                              navigate('/patient-monitor')
                            }
                          }}
                          value={String(room.resource.name)}
                          sx={{
                            justifyContent: 'center',
                            padding: '6%',
                            backgroundColor: '#F3F2F7',
                            color: '#124D81',
                          }}
                          disabled={!darkMode}
                        >
                          {/* {room.resource.name.toString()} */}
                          {room.resource.name.toString()} 
                        </MenuItem>
                        
                      );
                      
                    })}
                    
                    
                            
                          </Select>
                        </FormControl>
                        <Divider orientation="vertical" flexItem sx={{ marginLeft: '20px' }} />
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
  <Button
    variant="text"
    style={{
      width: '150px', // Set a fixed width for the buttons
      borderRadius: '25px',
      backgroundColor: !darkMode ? '#124D81' : 'white',
      color: !darkMode ? 'white' : '#124D81',
      padding: '10px',
      margin: '5px',
    }}
    onClick={handleDMSChange}
  >
    Baby Mode
  </Button>
  <Button
    variant="text"
    style={{
      width: '150px', // Set a fixed width for the buttons
      borderRadius: '25px',
      backgroundColor: darkMode ? '#124D81' : 'white',
      color: darkMode ? 'white' : '#124D81',
      padding: '10px',
      margin: '5px',
    }}
    onClick={handleDMSChange}
  >
    Device Mode
  </Button>
</div>


                        
                        {/* Render a disabled component for Room and Device Settings */}
                        
                      </>
                    )}
                    {/* Common code for both roles */}
                   
                    
                  </Stack>
                </>
              ) : (
                <>
                  <IconButton onClick={() => settemp(true)}>
                    <MenuIcon />
                  </IconButton>
                  <Drawer
                    anchor="right"
                    open={temp}
                    onClose={() => settemp(false)}
                    PaperProps={{ style: { width: '40%', backgroundColor: 'black' } }}
                  >
                    <Stack width={'100%'} height={'100%'} sx={{ backgroundColor: '#131726' }} divider={<Divider />}>
                      <Stack height={'5%'} justifyContent={'center'} alignItems={'center'}>
                        <Typography>Settings</Typography>
                      </Stack>
                      {notHome && UserRole === 'Hospital Clinician' && (
  <Stack direction={'row'} width={'100%'} height={'5%'} justifyContent={'center'} marginBottom={'3%'} marginTop={'5%'}>
    <ToggleButtonGroup
      color="primary"
      value={darkMode ? 'dark' : 'light'}
      exclusive
      onChange={handleDMSChange}
      aria-label="Dark Mode Switch"
    >
      <ToggleButton value="light" sx={{ width: 'auto' }}>
        Baby Mode
      </ToggleButton>
      <ToggleButton value="dark" sx={{ width: 'auto' }}>
        Device Mode
      </ToggleButton>
    </ToggleButtonGroup>
  </Stack>
)}
{/* mobile view */}
                      <List>
                        <ListItemButton onClick={() => setSmallList(!smallList)}>
                          <ListItemText>
                            <Typography variant='h6' style={{ marginTop: '3%', paddingBottom: '3%' }}>Rooms </Typography>
                          </ListItemText>
                          {smallList ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                        <Collapse in={smallList} timeout="auto" unmountOnExit>
                          <List component="div" disablePadding>
                            {temproom.map((room) => (
                              <ListItem key={room.resource.id}>
                                <ListItemButton
                                  onClick={() => {
                                    if (darkMode) {
                                      handleSetRoom2(room.resource.name);
                                      setNotHome(true);
                                      navigate('/device-monitor');
                                    }
                                  }}
                                  sx={{
                                    marginLeft: '20px',
                                    padding: '6%',
                                    backgroundColor: '',
                                  }}
                                  disabled={!darkMode}
                                >
                                  {room.resource.name.toString()}
                                </ListItemButton>
                                
                              </ListItem>
                            ))}

                            
                            {notHome && UserRole === 'Hospital Technician' && (
                              <><MenuItem
                                  value="R&D"
                                  sx={{
                                    width: 'auto', padding: '6%', backgroundColor: '#131726', borderTop: '1px solid grey',
                                  }}
                                  onClick={() => {
                                    navigate('/rooms');
                                    setNotHome(false);
                                    setPrevRoom(room);
                                  } }
                                >
                                  Rooms & Device Settings <SettingsIcon sx={{ marginLeft: 'auto' }} />
                                </MenuItem><MenuItem
                                  value="R&D"
                                  sx={{
                                    width: '100%',
                                    padding: '6%',
                                    paddingLeft: '20px',
                                    backgroundColor: '#131726',
                                    textAlign:'space-between,'
                                  }}
                                  onClick={handleAdminClick}
                                  
                                >
                                    Admin Access <PersonIcon sx={{ marginLeft: 'auto' }} />
                                  </MenuItem></>
                              
                            )}
                          </List>
                          
                        </Collapse>
                      </List>
                      <Box width={'100%'} height={'200px'} marginTop={'auto'} sx={{ backgroundColor: '#131726' }}>
                        <Stack direction={'row'} justifyContent={'space-between'}>
                          <Typography style={{ marginLeft: '3%', marginTop: '5%', marginBottom: '5%' }}>
                            Hospital Name
                          </Typography>
                          <Button onClick={() => logout()} sx={{ color: 'white', textTransform: 'capitalize' }}>
                            <Typography variant="subtitle2">Sign out</Typography>
                          </Button>
                        </Stack>
                        <Stack direction={'row'} width={'100%'}>
                          <Avatar style={{ marginLeft: '3%', marginTop: '2%', width: 100, height: 100 }}>
                            {(() => (
                              <Typography variant="h3">{String(user?.nickname)[0].toUpperCase()}</Typography>
                            ))()}
                          </Avatar>
                          <Stack>
                            <Typography variant="h5" style={{ marginLeft: '8%', marginTop: '2%' }}>
                              {user?.nickname}
                            </Typography>
                            <Typography variant="subtitle1" style={{ marginLeft: '8%', marginTop: '2%' }}>
                              {user?.email}
                            </Typography>
                            <Typography variant="subtitle2" style={{ marginLeft: '8%', marginTop: '2%' }}>
                              Designation
                            </Typography>
                          </Stack>
                        </Stack>
                      </Box>
                    </Stack>
                  </Drawer>
                </>
              )}
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};
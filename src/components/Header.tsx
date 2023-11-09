import React, { FC, useEffect, useState } from 'react';
import {AppBar, Collapse, Divider,Drawer,FormControl,IconButton,InputLabel,List,ListItem,ListItemButton,ListItemText,Menu,MenuItem,Select,SelectChangeEvent, Stack,Switch, SwitchProps, styled, useMediaQuery, useTheme} from '@mui/material';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import SettingsIcon from '@mui/icons-material/Settings';
import Button from '@mui/material/Button';
import { AccountCircle, ExpandLess, ExpandMore } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import pmsLogo from '../assets/phx_logo.png';
import { useAuth0 } from '@auth0/auth0-react';
import { Avatar, Typography } from '@material-ui/core';
import MenuIcon from '@mui/icons-material/Menu';

export interface HeaderProps {
  currentRoom: string;
  roomChange: (roomId: string) => void;
  roomAltered: boolean;
}

export const Header: FC<HeaderProps> = (props) => {
  const [smallList, setSmallList] = useState(false)
  const navigate = useNavigate();
  const theme = useTheme();
  const screenSize = useMediaQuery(theme.breakpoints.up('md'));
  const { user, isLoading, isAuthenticated, logout } = useAuth0();
  const [notHome, setNotHome] = useState(true)
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
  const [darkMode, setDarkMode] = useState(true); // Default to dark mode being active

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
    setRoom(value);
    props.roomChange(
      temproom[
        temproom.findIndex(
          (item) => item.resource.name.toString() === String(value)
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

  // const CustomSwitch = styled((props: SwitchProps) => (
  //   <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
  // ))(({ theme }) => ({
  //   marginTop:10,
  //   width: 100,
  //   height: 30,
  //   padding: 0,
  
  //   '& .MuiSwitch-switchBase': {
  //     padding: 0,
  //     margin: 2,
  //     transitionDuration: '300ms',
  //     '&.Mui-checked': {
  //       transform: 'translateX(70px)',
  //       color: '#fff',
  //       '& + .MuiSwitch-track': {
  //         backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#65C466',
  //         opacity: 1,
  //         border: 0,
          
  //       },
  //       '&.Mui-disabled + .MuiSwitch-track': {
  //         opacity: 0.5,
  //       },
  //     },
  //     '&.Mui-focusVisible .MuiSwitch-thumb': {
  //       color: '#33cf4d',
  //       border: '6px solid #fff',
  //     },
  //     '&.Mui-disabled .MuiSwitch-thumb': {
  //       color:
  //         theme.palette.mode === 'light'
  //           ? theme.palette.grey[100]
  //           : theme.palette.grey[600],
  //     },
  //     '&.Mui-disabled + .MuiSwitch-track': {
  //       opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
  //     },
  //   },
  //   '& .MuiSwitch-thumb': {
  //     boxSizing: 'border-box',
  //     width: 22,
  //     height: 22,
  //     marginTop:2,
  //     marginLeft:2
  //   },
  //   '& .MuiSwitch-track': {
  //     borderRadius: 26 / 2,
  //     backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
  //     opacity: 1,
  //     transition: theme.transitions.create(['background-color'], {
  //       duration: 500,
  //     }),
  //   },
  // }));


  // const CustomSwitch = styled((props: SwitchProps) => (
  //   <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
  // ))(({ theme }) => ({
  //   marginTop: 10,
  //   width: 100,
  //   height: 30,
  //   padding: 0,
  
  //   '& .MuiSwitch-track': {
  //     borderRadius: 20 / 2,
  //     '&:before, &:after': {
  //       content: "''", // Empty content for pseudo-elements
  //       position: 'absolute',
  //       top: '50%',
  //       transform: 'translateY(-50%)',
  //       width: 16,
  //       height: 16,
  //     },
  //     '&:before': {
  //       content: '"ON"', // Text content for the ':before' pseudo-element
  //       left: 12,
  //       /* Other styles for the before pseudo-element */
  //     },
  //     '&:after': {
  //       content: '"OFF"', // Text content for the ':after' pseudo-element
  //       right: 12,
  //       /* Other styles for the after pseudo-element */
  //     },
  //   },
  //   '& .MuiSwitch-thumb': {
  //     boxShadow: 'none',
  //     width: 16,
  //     height: 16,
  //     margin: 2,
  //   },
  // }));
  
  const CustomSwitch = styled((props: SwitchProps) => (
    <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
  ))(({ theme }) => ({
    marginTop: 10,
    width: 130,
    height: 30,
    padding: 0,
  
    '& .MuiSwitch-switchBase': {
      padding: 0,
      margin: 2,
      color:'#00B1FD',
      transitionDuration: '300ms',
      '&.Mui-checked': {
        transform: 'translateX(100px)',
        color: '#00B1FD',
        '& + .MuiSwitch-track': {
          backgroundColor: theme.palette.mode === 'dark' ? '#252D49' : '#252D49',
          opacity: 1,
          border: 0,
        },
        '&.Mui-disabled + .MuiSwitch-track': {
          opacity: 0.5,
        },
      },
      '&.Mui-focusVisible .MuiSwitch-thumb': {
        color: '#33cf4d',
        border: '6px solid #fff',
      },
      '&.Mui-disabled .MuiSwitch-thumb': {
        color:
          theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[600],
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
      },
    },
    '& .MuiSwitch-thumb': {
      boxSizing: 'border-box',
      width: 22,
      height: 22,
      marginTop: 2,
      marginLeft: 2,
    },
    '& .MuiSwitch-track': {
      borderRadius: 44/ 2,
      backgroundColor: theme.palette.mode === 'light' ? '#252D49' : '#252D49',
      opacity: 1,
      transition: theme.transitions.create(['background-color'], {
        duration: 500,
      }),
  
      '&::before': {
        content: '""', 
        position: 'absolute',
        top: '10%',
        left: '1px', 
        color: 'white',
        padding: '5px', 
        borderRadius: '4px', 
      },
  
      '&::after': {
        content: '"Patient Mode"', 
        position: 'absolute',
        top: '1%',
        right: '2px', 
        color: 'white',
        padding: '5px', 
        borderRadius: '4px',
      },
    },
    '& .Mui-checked + .MuiSwitch-track::before': {
      content: '"Device Mode"', 
      position: 'absolute',
        top: '1%',
        color: 'white',
        borderRadius: '4px',
    },
    '& .Mui-checked + .MuiSwitch-track::after': {
      content: '""', 
      
    },
  }));
  
 

  // const handleDMSChange = () => {
  //   // Handle the state change when the switch is toggled
  //   setDarkMode(!darkMode);

  //   // If darkMode is false, navigate to the '/rooms' route
  //   if (!darkMode) {
  //     navigate('/rooms');
  //   }
  // };
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
    if (isAuthenticated) {
      fetch(`http://pmscloud.in:9444/fhir-server/api/v4/Location`, {
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
        });
    }
  }, [isAuthenticated]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      fetch(`http://pmscloud.in:9444/fhir-server/api/v4/Location`, {
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
        });
    }
  }, [props.roomAltered]);

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

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        style={{ background: 'transparent', boxShadow: 'none' }}
        sx={{ boxShadow: '0px 5px 5px 0px yellow' }}
      >
        
        <Toolbar>

          {!isLoading && isAuthenticated && (
            <>
              <div style={{ display: 'flex', marginRight: 'auto' }}>
                <Box onClick={handleBackButtonClick} sx={{ cursor: 'pointer' }}>
                  <img
                    src={pmsLogo}
                    alt="Phoenix"
                    style={{
                      maxWidth: '70%',
                      height: 'auto',
                    }}
                  />
                </Box>
              </div>
              {screenSize ? (<>
                <Box marginRight={'3%'} marginTop={{xs: '0%',
                    sm: '0%',
                    md: '1%',
                    lg: '1%',}} > 
                    {/* <Switch 
                checked={darkMode}
                onChange={handleDMSChange}
                sx={{
                  "&$checked": {
                    color: "red"
                  },
                  "$checked$checked + &": {
                    // Controls checked color for the track
                    opacity: 0.7,
                    backgroundColor: "#fff"
                  }
                }}
              />  */}
              
              
              </Box>
             <Stack direction={'row'} justifyContent={'center'} textAlign={'center'} >
              {notHome && <CustomSwitch onChange={handleDMSChange} checked={darkMode} />}
              {notHome && <Divider orientation="vertical" flexItem sx={{ marginRight: '20px',marginLeft: '20px' }} />}
                <FormControl variant="standard" sx={{ width: '200px'}}>
                  <InputLabel id="demo-simple-select-standard-label">Room</InputLabel>
                  <Select
                    label="Room"
                    onChange={handleSetRoom}
                    value={room}
                    MenuProps={{
                      MenuListProps: { disablePadding: true },
                      sx: {
                        '&& .Mui-selected': {
                          backgroundColor: '#2BA0E0',
                        },
                      },
                    }}
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
                            backgroundColor: '#131726',
                          }}
                          disabled={!darkMode}
                        >
                          {room.resource.name.toString()}
                        </MenuItem>
                      );
                    })}
                    <MenuItem
                      value="R&D"
                      sx={{
                        width: '250px',
                        padding: '6%',
                        backgroundColor: '#131726',
                        borderTop: '1px solid grey',
                      }}
                      onClick={() => {
                        navigate('/rooms');
                        setNotHome(false)
                        setPrevRoom(room);
                      }}
                    >
                      Rooms & Device Settings <SettingsIcon sx={{ marginLeft: 'auto' }} />
                    </MenuItem>
                  </Select>
                </FormControl>
                <Divider orientation="vertical" flexItem sx={{ marginLeft: '20px' }} />
                <Button
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                  sx={{ marginLeft: '10px', justifyContent:'center', textAlign:'center' }}
                  endIcon={<AccountCircle />}
                  
                >
                  <Typography variant="subtitle1" component="h2">
                    &nbsp; {user?.nickname} &nbsp;
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
                  <Box width={'350px'} height={'200px'} sx={{ backgroundColor: '#131726' }}>
                    <Stack direction={'row'} justifyContent={'space-between'}>
                      <Typography style={{ marginLeft: '5%', marginTop: '5%', marginBottom: '5%' }}>
                        Hospital Name
                      </Typography>
                      <Button onClick={() => logout()} sx={{ color: 'white', textTransform: 'capitalize' }}>
                        <Typography variant="subtitle2">Sign out</Typography>
                      </Button>
                    </Stack>
                    <Stack direction={'row'} width={'100%'}>
                      <Avatar
                        style={{ marginLeft: '5%', marginTop: '2%', width: 100, height: 100 }}
                      >
                        {(() => {
                          return (
                            <Typography variant="h3">
                              {String(user?.nickname)[0].toUpperCase()}
                            </Typography>
                          );
                        })()}
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
              </Stack>
          
          </>):(<>
            <IconButton onClick={(() => {settemp(true)})}>
              <MenuIcon></MenuIcon>
            </IconButton>
            <Drawer anchor='right'  open={temp}  onClose={(() => {settemp(false)})}  PaperProps={{ style:{  width:'40%',  backgroundColor:"black"  }
              }}
            >
              <Stack width={'100%'} height={'100%'} sx={{ backgroundColor: '#131726'}} divider={
  <Divider />
              }
              >
                <Stack direction={'row'} width={'95%'} justifyContent={'space-between'} marginLeft={'3%'} marginTop={'5%'}>
                  <Typography variant='h6' style={{marginTop: '3%', paddingBottom:'3%'}}>Mode Switch</Typography>
                  <CustomSwitch onChange={handleDMSChange} checked={darkMode} />
                </Stack>
                 <List sx={{}}>
                  <ListItemButton onClick={(() => {setSmallList(!smallList)})}>
                    <ListItemText>
                      <Typography variant='h6' style={{marginTop: '3%', paddingBottom:'3%'}}>Rooms </Typography>
                    </ListItemText>
                    {smallList ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                  <Collapse in={smallList} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding >
                      {temproom.map((room, index) => {
                        return (
                          <ListItem key={room.resource.id}  >
                      
              <ListItemButton
              selected={selectedIndex===index}
                onClick={() => { 
                  
                  setSelectedIndex(index)
                  if (darkMode) { // Check if darkMode is 'off' before allowing the click
                    handleSetRoom2(room.resource.name);
                    setNotHome(true);
                    if (darkMode) {
                      navigate('/device-monitor');
                    } else {
                      navigate('/patient-monitor');
                    }
                  }
                }}
                sx={{
                  marginLeft: '20px',
                  padding: '6%',
                  backgroundColor:''
                  
                }}
                disabled={!darkMode} // Disable the menu item when darkMode is 'on'
              >
              {room.resource.name.toString()}
              </ListItemButton>
              </ListItem>
                );
                })}
                </List>
                <Divider sx={{border:'1px solid grey'}} ></Divider>
              <MenuItem value="R&D"
                sx={{
                  width: '250px',padding: '6%',backgroundColor: '#131726'}} onClick={() => {navigate('/rooms');setNotHome(false);setPrevRoom(room);}}>
                Rooms & Device Settings <SettingsIcon sx={{ marginLeft: 'auto' }} />
              </MenuItem>
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
                        <Avatar
                          style={{ marginLeft: '3%', marginTop: '2%', width: 100, height: 100 }}
                        >
                          {(() => {
                            return (
                              <Typography variant="h3">
                                {String(user?.nickname)[0].toUpperCase()}
                              </Typography>
                            );
                          })()}
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
          
          </>)}

            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {Dialog,DialogTitle,DialogContent,InputAdornment,IconButton,Typography,Stack,Box,Button,Table,TableBody,TableCell,TableHead,TableRow,TableContainer,Paper, TextField, MenuItem, Select,SelectChangeEvent, FormControl, InputLabel,
} from '@mui/material';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';

interface ServiceDetailsProps {
  isOpen: boolean;
  handleCloseDialog: () => void;
  deviceList: any[];
  organizationId: string;
  setDeviceMetrics: (metrics: any[]) => void;
  setDeviceStatus: (status: string) => void;
}

export const ServiceDetails: React.FC<ServiceDetailsProps> = ({isOpen,
  handleCloseDialog,
  deviceList,
  organizationId,
  setDeviceMetrics,
  setDeviceStatus,
}) => {
  // const [organizationName, setOrganizationName] = useState('');
  // const [deviceMetrics, setDeviceMetricsLocal] = useState<any[]>([]);
  // const [selectedDevice, setSelectedDevice] = useState<any | null>(null);
  // const [isHistoryView, setIsHistoryView] = useState(false);
  // const [searchQuery, setSearchQuery] = useState('');
  // const [deviceMetricsHistory, setDeviceMetricsHistory] = useState<any[]>([]);
  // const [sortCriteria, setSortCriteria] = useState<string>('time'); 

  // useEffect(() => {
  //   const fetchOrganizationDetails = async () => {
  //     try {
  //       const response = await fetch(`https://pmsserver.local/fhir/Organization/${organizationId}`, {
  //         headers: {
  //           Authorization: 'Basic ' + btoa('fhiruser:change-password'),
  //         },
  //       });
  //       const data = await response.json();
  //       setOrganizationName(data.name);
  //     } catch (error) {
  //       console.error('Error fetching organization details:', error);
  //     }
  //   };

  //   if (organizationId) {
  //     fetchOrganizationDetails();
  //   }
  // }, [organizationId]);

  // const filteredDeviceList = useMemo(() => {
  //   return deviceList
  //     .filter((device) => device.resource?.owner?.reference === `Organization/${organizationId}`)
  //     .filter((device) =>
  //       device.resource.identifier[0]?.value.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //       (device.resource.identifier[1]?.value && device.resource.identifier[1]?.value.toLowerCase().includes(searchQuery.toLowerCase()))
  //     );
  // }, [deviceList, organizationId, searchQuery]);

  // const fetchDeviceMetrics = useCallback(async () => {
  //   try {
  //     console.log('Starting to fetch device metrics...');
      
  //     // Fetch metrics for each device
  //     const metricsPromises = filteredDeviceList.map(async (device) => {
  //       console.log(`Fetching metrics for device ID: ${device.resource.id}`);
  //       const response = await fetch(`https://pmsserver.local/fhir/DeviceMetric?source=${device.resource.id}`, {
  //         headers: {
  //           Authorization: 'Basic ' + btoa('fhiruser:change-password'),
  //         },
  //       });
  
  //       // Check if the response is successful
  //       if (!response.ok) {
  //         console.error(`Failed to fetch metrics for device ID: ${device.resource.id}`, response.statusText);
  //         return [];
  //       }
  
  //       const data = await response.json();
  //       console.log(`Metrics data for device ID ${device.resource.id}:`, data);
  
  //       return data.entry ? data.entry.map((entry: any) => entry.resource) : [];
  //     });
  
  //     // Wait for all metrics promises to resolve
  //     const metrics = await Promise.all(metricsPromises);
  //     console.log('All metrics data:', metrics);
  
  //     // Flatten the metrics array
  //     const flatMetrics = metrics.flat();
  //     console.log('Flattened metrics:', flatMetrics);
  
  //     // Update local state and context
  //     setDeviceMetricsLocal(flatMetrics);
  //     setDeviceMetrics(flatMetrics);
  
  //     // Determine device status
  //     const hasError = flatMetrics.some(metric => metric.operationalStatus !== 'normal');
  //     console.log('Device operational status:', hasError ? 'Action Needed' : 'Normal');
  //     setDeviceStatus(hasError ? 'Action Needed' : 'Normal');
  
  //     // Send email with the new metrics
  //     console.log('Sending email with new metrics...');
  //     await sendEmail(flatMetrics);
  //     console.log('Email sent successfully.');
  
  //   } catch (error) {
  //     console.error('Error fetching device metrics:', error);
  //   }
  // }, [filteredDeviceList, setDeviceMetrics, setDeviceStatus]);
  

  // useEffect(() => {
  //   if (filteredDeviceList.length > 0) {
  //     fetchDeviceMetrics();
  //   }
  // }, [filteredDeviceList, fetchDeviceMetrics]);

  // const fetchDeviceMetricHistory = async (deviceMetricId: string) => {
  //   try {
  //     const response = await fetch(`https://pmsserver.local/fhir/DeviceMetric/${deviceMetricId}/_history`, {
  //       headers: {
  //         Authorization: 'Basic ' + btoa('fhiruser:change-password'),
  //       },
  //     });
  //     const data = await response.json();
  //     return data.entry ? data.entry.map((entry: any) => entry.resource) : [];
  //   } catch (error) {
  //     console.error('Error fetching device metric history:', error);
  //     return [];
  //   }
  // };

  // const handleButtonClick = async (device: any) => {
  //   setSelectedDevice(device);
  //   setIsHistoryView(true);

  //   const deviceMetricHistoryPromises = deviceMetrics
  //     .filter((metric) => metric.source.reference === `Device/${device.resource.id}`)
  //     .map((metric) => fetchDeviceMetricHistory(metric.id));

  //   const historyData = await Promise.all(deviceMetricHistoryPromises);
  //   const flatHistoryData = historyData.flat();
  //   setDeviceMetricsHistory(flatHistoryData);
  // };

  // const handleBackToList = () => {
  //   setIsHistoryView(false);
  //   setSelectedDevice(null);
  // };

  // const handleSortChange = (event: SelectChangeEvent<string>) => {
  //   setSortCriteria(event.target.value);
  // };

  // const sortedDeviceMetricsHistory = useMemo(() => {
  //   return [...deviceMetricsHistory].sort((a, b) => {
  //     switch (sortCriteria) {
  //       case 'time':
  //         return new Date(b.lastSystemChange).getTime() - new Date(a.lastSystemChange).getTime();
  //       case 'type':
  //         return (a.type.coding[0]?.display || '').localeCompare(b.type.coding[0]?.display || '');
  //       case 'status':
  //         return (a.operationalStatus || '').localeCompare(b.operationalStatus || '');
  //       default:
  //         return 0;
  //     }
  //   });
  // }, [deviceMetricsHistory, sortCriteria]);

  // const getDisplayValues = (coding: any[]) => {
  //   return coding.map((code: { display: any }) => code.display).join(', ');
  // };

  // const [varq, setvarq] = useState(false);

  // useEffect(() => {
  //   handleCloseDialog();
  // }, [varq]);


  // const sendEmail = async (metrics: any[]) => {
  //   try {
  //     const response = await fetch('http://localhost:3000/send-email', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ message: 'New device metrics fetched', metrics }),
  //     });

  //     if (!response.ok) {
  //       throw new Error('Network response was not ok');
  //     }

  //     const result = await response.text();
  //     console.log('Email sent:', result);
  //   } catch (error) {
  //     console.error('Error sending email:', error);
  //   }
  // };

  const [organizationName, setOrganizationName] = useState('');
  const [deviceMetrics, setDeviceMetricsLocal] = useState<any[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<any | null>(null);
  const [isHistoryView, setIsHistoryView] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [deviceMetricsHistory, setDeviceMetricsHistory] = useState<any[]>([]);
  const [sortCriteria, setSortCriteria] = useState<string>('time'); // default sorting by time
  const [varq, setvarq] = useState(false);

  useEffect(() => {
    const fetchOrganizationDetails = async () => {
      try {
        const response = await fetch(`https://pmsserver.local/fhir/Organization/${organizationId}`, {
          headers: {
            Authorization: 'Basic ' + btoa('fhiruser:change-password'),
          },
        });
        const data = await response.json();
        setOrganizationName(data.name);
      } catch (error) {
        console.error('Error fetching organization details:', error);
      }
    };

    if (organizationId) {
      fetchOrganizationDetails();
    }
  }, [organizationId]);
  // useEffect(() => {
  //   let ws: WebSocket;
  
  //   if (isOpen) {
  //     ws = new WebSocket('wss://pmsserver.local/fhir');
  //     ws.onopen = () => {
  //       console.log('WebSocket connection opened');
  //     };
  
  //     ws.onmessage = (event) => {
  //       const message = JSON.parse(event.data);
  //       if (message.resourceType === 'DeviceMetric') {
  //         // Update metrics state with new data
  //         setDeviceMetricsLocal((prevMetrics) => {
  //           const updatedMetrics = prevMetrics.map(metric =>
  //             metric.id === message.id ? message : metric
  //           );
  //           // If metric is new, add it to the list
  //           if (!prevMetrics.some(metric => metric.id === message.id)) {
  //             updatedMetrics.push(message);
  //           }
  //           return updatedMetrics;
  //         });
  
  //         // Update history with new data
  //         setDeviceMetricsHistory((prevHistory) => [message, ...prevHistory]);
  //       }
  //     };
  
  //     ws.onclose = () => {
  //       console.log('WebSocket connection closed');
  //     };
  
  //     ws.onerror = (error) => {
  //       console.error('WebSocket error:', error);
  //     };
  //   }
  
  //   return () => {
  //     if (ws) {
  //       ws.close();
  //     }
  //   };
  // }, [isOpen]);
  useEffect(() => {
    let ws: WebSocket;

    if (isOpen) {
      ws = new WebSocket('wss://pmsserver.local/fhir');
      ws.onopen = () => {
        console.log('WebSocket connection opened');
      };

      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.resourceType === 'DeviceMetric') {
          // Update metrics state with new data
          setDeviceMetricsLocal((prevMetrics) => {
            const updatedMetrics = prevMetrics.map(metric =>
              metric.id === message.id ? message : metric
            );
            // If metric is new, add it to the list
            if (!prevMetrics.some(metric => metric.id === message.id)) {
              updatedMetrics.push(message);
            }
            // Trigger re-render
            setDeviceMetrics(updatedMetrics);
            // Determine device status
            const hasError = updatedMetrics.some(metric => metric.operationalStatus !== 'normal');
            setDeviceStatus(hasError ? 'Action Needed' : 'Normal');
            return updatedMetrics;
          });

          // Update history with new data
          setDeviceMetricsHistory((prevHistory) => [message, ...prevHistory]);

          // Check for critical codes and send email if found
          const hasCritical = message.type.coding.some((code: any) => hasCriticalCodes([code]));
          if (hasCritical) {
            sendEmail([message]);
          }
        }
      };

      ws.onclose = () => {
        console.log('WebSocket connection closed');
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    }

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [isOpen]);
  const filteredDeviceList = useMemo(() => {
    return deviceList
      .filter((device) => device.resource?.owner?.reference === `Organization/${organizationId}`)
      .filter((device) =>
        device.resource.identifier[0]?.value.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (device.resource.identifier[1]?.value && device.resource.identifier[1]?.value.toLowerCase().includes(searchQuery.toLowerCase()))
      );
  }, [deviceList, organizationId, searchQuery]);

  // const fetchDeviceMetrics = useCallback(async () => {
  //   try {
  //     console.log('Starting to fetch device metrics...');
      
  //     // Fetch metrics for each device
  //     const metricsPromises = filteredDeviceList.map(async (device) => {
  //       console.log(`Fetching metrics for device ID: ${device.resource.id}`);
  //       const response = await fetch(`https://pmsserver.local/fhir/DeviceMetric?source=${device.resource.id}`, {
  //         headers: {
  //           Authorization: 'Basic ' + btoa('fhiruser:change-password'),
  //         },
  //       });
    
  //       if (!response.ok) {
  //         console.error(`Failed to fetch metrics for device ID: ${device.resource.id}`, response.statusText);
  //         return [];
  //       }
    
  //       const data = await response.json();
  //       console.log(`Metrics data for device ID ${device.resource.id}:`, data);
    
  //       return data.entry ? data.entry.map((entry: any) => entry.resource) : [];
  //     });
    
  //     const metrics = await Promise.all(metricsPromises);
  //     const flatMetrics = metrics.flat();
  //     console.log('Flattened metrics:', flatMetrics);
    
  //     setDeviceMetricsLocal(flatMetrics);
  //     setDeviceMetrics(flatMetrics);
    
  //     const hasError = flatMetrics.some(metric => metric.operationalStatus !== 'normal');
  //     console.log('Device operational status:', hasError ? 'Action Needed' : 'Normal');
  //     setDeviceStatus(hasError ? 'Action Needed' : 'Normal');
    
  //     console.log('Sending email with new metrics...');
  //     await sendEmail(flatMetrics);
  //     console.log('Email sent successfully.');
    
  //   } catch (error) {
  //     console.error('Error fetching device metrics:', error);
  //   }
  // }, [filteredDeviceList, setDeviceMetrics, setDeviceStatus]);
  const fetchDeviceMetrics = useCallback(async () => {
  try {
    console.log('Starting to fetch device metrics...');
    
    // Fetch metrics for each device
    const metricsPromises = filteredDeviceList.map(async (device) => {
      console.log(`Fetching metrics for device ID: ${device.resource.id}`);
      const response = await fetch(`https://pmsserver.local/fhir/DeviceMetric?source=${device.resource.id}`, {
        headers: {
          Authorization: 'Basic ' + btoa('fhiruser:change-password'),
        },
      });

      // Check if the response is successful
      if (!response.ok) {
        console.error(`Failed to fetch metrics for device ID: ${device.resource.id}`, response.statusText);
        return [];
      }

      const data = await response.json();
      console.log(`Metrics data for device ID ${device.resource.id}:`, data);

      return data.entry ? data.entry.map((entry: any) => entry.resource) : [];
    });

    // Wait for all metrics promises to resolve
    const metrics = await Promise.all(metricsPromises);
    console.log('All metrics data:', metrics);

    // Flatten the metrics array
    const flatMetrics = metrics.flat();
    console.log('Flattened metrics:', flatMetrics);

    // Update local state and context
    setDeviceMetricsLocal(flatMetrics);
    setDeviceMetrics(flatMetrics);

    // Determine device status
    const hasError = flatMetrics.some(metric => metric.operationalStatus !== 'normal');
    console.log('Device operational status:', hasError ? 'Action Needed' : 'Normal');
    setDeviceStatus(hasError ? 'Action Needed' : 'Normal');

    // Check for critical codes and send email if found
    const hasCritical = flatMetrics.some(metric => hasCriticalCodes(metric.type.coding));
    if (hasCritical) {
      console.log('Sending email due to critical codes...');
      await sendEmail(flatMetrics);
      console.log('Email sent successfully.');
    }

  } catch (error) {
    console.error('Error fetching device metrics:', error);
  }
}, [filteredDeviceList, setDeviceMetrics, setDeviceStatus]);

  useEffect(() => {
    if (filteredDeviceList.length > 0) {
      fetchDeviceMetrics();
    }
  }, [filteredDeviceList, fetchDeviceMetrics]);

  const fetchDeviceMetricHistory = async (deviceMetricId: string) => {
    try {
      const response = await fetch(`https://pmsserver.local/fhir/DeviceMetric/${deviceMetricId}/_history`, {
        headers: {
          Authorization: 'Basic ' + btoa('fhiruser:change-password'),
        },
      });
      const data = await response.json();
      return data.entry ? data.entry.map((entry: any) => entry.resource) : [];
    } catch (error) {
      console.error('Error fetching device metric history:', error);
      return [];
    }
  };

  const handleButtonClick = async (device: any) => {
    setSelectedDevice(device);
    setIsHistoryView(true);

    const deviceMetricHistoryPromises = deviceMetrics
      .filter((metric) => metric.source.reference === `Device/${device.resource.id}`)
      .map((metric) => fetchDeviceMetricHistory(metric.id));

    const historyData = await Promise.all(deviceMetricHistoryPromises);
    const flatHistoryData = historyData.flat();
    setDeviceMetricsHistory(flatHistoryData);
  };

  const handleBackToList = () => {
    setIsHistoryView(false);
    setSelectedDevice(null);
  };

  const handleSortChange = (event: SelectChangeEvent<string>) => {
    setSortCriteria(event.target.value);
  };

  const sortedDeviceMetricsHistory = useMemo(() => {
    return [...deviceMetricsHistory].sort((a, b) => {
      switch (sortCriteria) {
        case 'time':
          return new Date(b.lastSystemChange).getTime() - new Date(a.lastSystemChange).getTime();
        case 'type':
          return (a.type.coding[0]?.display || '').localeCompare(b.type.coding[0]?.display || '');
        case 'status':
          return (a.operationalStatus || '').localeCompare(b.operationalStatus || '');
        default:
          return 0;
      }
    });
  }, [deviceMetricsHistory, sortCriteria]);

  const getDisplayValues = (coding: any[]) => {
    return coding.map((code: { display: any }) => code.display).join(', ');
  };

  useEffect(() => {
    handleCloseDialog();
  }, [varq]);

  
  const hasCriticalCodes = (coding: any[]) => {
    const criticalCodes = [56, 46, 45, 27, 23, 10];
    return coding.some(code => criticalCodes.includes(parseInt(code.code)));
  };
  
  const sendEmail = async (metrics: any[]) => {
    try {
      const response = await fetch('http://localhost:3000/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: 'New device metrics fetched', metrics }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.text();
      console.log('Email sent:', result);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  return (
    <Dialog
      open={isOpen}
      sx={{
        backdropFilter: 'blur(5px)',
      }}
      onClose={() => {
        setvarq(!varq);
      }}
      maxWidth="lg"
      PaperProps={{
        sx: {
          minWidth: {
            xs: '90%',
            sm: '90%',
            md: '70%',
            lg: '75%',
          },
          maxWidth: {
            xs: '90%',
            sm: '90%',
            md: '80%',
            lg: '80%',
          },
          minHeight: '90%',
          borderRadius: '25px',
          border: '1px solid #505050',
        },
      }}
    >
      <DialogTitle
        sx={{
          borderBottom: '1px solid white',
        }}
      >
        <Stack direction={'row'} width={'100%'} justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight={'regular'}>
            Devices in {organizationName}
          </Typography>

          <Stack direction={'row'} spacing={2}>
            <TextField
              variant="outlined"
              size="small"
              inputProps={{ style: { color: '#FFFFFF' } }} // Set text color to blue
              sx={{
                backgroundcolor: '#FFFFFF',
                '& .MuiOutlinedInput-root': {
                  borderRadius: '20px', // Set border radius
                  borderColor: '#F9F9F9', // Set border color
                  borderStyle: 'solid', // Set border style
                  borderWidth: '1px', // Set border width
                  '&:hover fieldset': {
                    borderColor: '#124D81', // Set border color on hover
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#124D81', // Set border color when focused
                  },
                },
              }}
              placeholder="Search Device"
              style={{ width: '200px' }}
              value={searchQuery} // Bind searchQuery to TextField value
              onChange={(e) => setSearchQuery(e.target.value)} // Handle input change
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon style={{ color: '#FFFFFF' }} />
                  </InputAdornment>
                ),
              }}
            />

            <IconButton sx={{ width: '45px', marginTop: '-4px' }} onClick={() => { setvarq(!varq) }}>
              <FontAwesomeIcon style={{ padding: '0px', margin: '0px', color: 'white' }} icon={faXmark} />
            </IconButton>
          </Stack>
        </Stack>
      </DialogTitle>
      <DialogContent
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'stretch',
        }}
      >
        {/* <Box width={'100%'} sx={{ padding: '10px' }}>
          {!isHistoryView ? (
            filteredDeviceList.length > 0 ? (
              filteredDeviceList.map((device, index) => (
                <Box
                key={index}
                style={{ textAlign: 'center', marginBottom: '10px' }}
                sx={{
                  border: '1px solid red',
                  borderRadius: '10px',
                  backgroundColor: '#1C1C1E',
                  padding: '10px',
                  justifyContent: 'space-between',
                }}
              >
                <Stack direction="row" spacing={3} alignItems="center" justifyContent="space-between">
                  <Typography variant="caption" color={'#FFFFFF'}>
                    {`${device.resource.identifier[1]?.value || ''}`} (<b>{`${device.resource.identifier[0]?.value}`}</b>)
                  </Typography>
        
                  <Box>
                    {deviceMetrics
                      .filter((metric) => metric.source.reference === `Device/${device.resource.id}`)
                      .map((metric, idx) => (
                        <Typography key={idx} variant="caption" color={'#FFFFFF'}>
                          {metric.type.coding[0]?.display}
                        </Typography>
                      //    <Typography key={idx} variant="caption" color={'#FFFFFF'}>
                      //    {getDisplayValues(metric.type.coding)}
                      //  </Typography>
                      ))}
                  </Box>
                  <Button
                    variant="outlined"
                    sx={{
                      color: 'white',
                      borderColor: 'white',
                      '&:hover': {
                        backgroundColor: 'white',
                        color: 'black'
                      }
                    }}
                    onClick={() => handleButtonClick(device)}
                  >
                    View History
                  </Button>
                </Stack>
              </Box>
              ))
            ) : (
              <Typography>No devices found.</Typography>
            )
          ) : (
            <>
              <Stack direction={'row'} justifyContent="space-between">
                <Button
                  startIcon={<ArrowBackIcon />}
                  onClick={handleBackToList}
                  sx={{ marginBottom: '20px' }}
                >
                  Back to Device List
                </Button>
                <FormControl sx={{ marginBottom: '20px', width: '15%', borderRadius: '25px' }}>
                  <InputLabel id="sort-select-label">Sort By</InputLabel>
                  <Select
                    labelId="sort-select-label"
                    value={sortCriteria}
                    label="Sort By"
                    onChange={handleSortChange}
                  >
                    <MenuItem value="time">Time</MenuItem>
                    <MenuItem value="type">Alarm</MenuItem>
                    <MenuItem value="status">Operational Status</MenuItem>
                  </Select>
                </FormControl>
              </Stack>

              {selectedDevice && (
                <>
                  <Stack>
                    <Typography variant="subtitle1">
                      Device ID: {selectedDevice.resource.identifier[0]?.value}
                    </Typography>
                    <Typography variant="subtitle1">
                      Device Name: {selectedDevice.resource.identifier[1]?.value}
                    </Typography>
                  </Stack>

                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                        <TableCell>S.No</TableCell>
                          <TableCell>Critical Alarm</TableCell>
                          <TableCell>Operational Status</TableCell>
                          <TableCell>Last System Change</TableCell>
                          <TableCell>Internal Oximeter </TableCell>
                          <TableCell>Weighing Scale</TableCell>
                         
                          
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {sortedDeviceMetricsHistory
                          .filter((metric) => metric.source.reference === `Device/${selectedDevice.resource.id}`)
                          .map((metric, index) => (
                            <TableRow key={index}>
                              <TableCell>{metric.extension?.find((ext: { url: string; }) => ext.url === 'http://example.org/fhir/StructureDefinition/SerialNumber')?.valueString || 'N/A'}</TableCell>
                              <TableCell>{getDisplayValues(metric.type.coding)}</TableCell>
                              <TableCell>{metric.operationalStatus}</TableCell>
                              <TableCell>{metric.meta.lastUpdated}</TableCell>
                              <TableCell>{metric.extension?.find((ext: { url: string; }) => ext.url === 'http://example.org/fhir/StructureDefinition/InternalMasimo')?.valueString || 'N/A'}</TableCell>
                              <TableCell>{metric.extension?.find((ext: { url: string; }) => ext.url === 'http://example.org/fhir/StructureDefinition/BabyWeighScale')?.valueString || 'N/A'}</TableCell>
                              
                             
                              
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </>
              )}
            </>
          )}
        </Box> */}
        <Box width={'100%'} sx={{ padding: '10px' }}>
  {!isHistoryView ? (
    filteredDeviceList.length > 0 ? (
      filteredDeviceList.map((device, index) => {
        const hasCriticalMetric = deviceMetrics
          .filter((metric) => metric.source.reference === `Device/${device.resource.id}`)
          .some((metric) => hasCriticalCodes(metric.type.coding));
        
        return (
          <Box
            key={index}
            style={{ textAlign: 'center', marginBottom: '10px' }}
            sx={{
              border: hasCriticalMetric ? '1px solid red' : '1px solid gray', // Change border color based on critical codes
              borderRadius: '10px',
              backgroundColor: '#1C1C1E',
              padding: '10px',
              justifyContent: 'space-between',
            }}
          >
            <Stack direction="row" spacing={3} alignItems="center" justifyContent="space-between">
              <Typography variant="caption" color={'#FFFFFF'}>
                {`${device.resource.identifier[1]?.value || ''}`} (<b>{`${device.resource.identifier[0]?.value}`}</b>)
              </Typography>

              <Box>
                {deviceMetrics
                  .filter((metric) => metric.source.reference === `Device/${device.resource.id}`)
                  .map((metric, idx) => (
                    // <Typography key={idx} variant="caption" color={'#FFFFFF'}>
                    //   {metric.type.coding[0]?.display}
                    // </Typography>
                    <Typography key={idx} variant="caption" color={'#FFFFFF'}>
                          {getDisplayValues(metric.type.coding)}
                        </Typography>
                  ))}
              </Box>
              <Button
                variant="outlined"
                sx={{
                  color: 'white',
                  borderColor: 'white',
                  '&:hover': {
                    backgroundColor: 'white',
                    color: 'black',
                  },
                }}
                onClick={() => handleButtonClick(device)}
              >
                View History
              </Button>
            </Stack>
          </Box>
        );
      })
    ) : (
      <Typography>No devices found.</Typography>
    )
  ) : (
    <>
      <Stack direction={'row'} justifyContent="space-between">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBackToList}
          sx={{ marginBottom: '20px' }}
        >
          Back to Device List
        </Button>
        <FormControl sx={{ marginBottom: '20px', width: '15%', borderRadius: '25px' }}>
          <InputLabel id="sort-select-label">Sort By</InputLabel>
          <Select
            labelId="sort-select-label"
            value={sortCriteria}
            label="Sort By"
            onChange={handleSortChange}
          >
            <MenuItem value="time">Time</MenuItem>
            <MenuItem value="type">Alarm</MenuItem>
            <MenuItem value="status">Operational Status</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {selectedDevice && (
        <>
          <Stack>
            <Typography variant="subtitle1">
              Device ID: {selectedDevice.resource.identifier[0]?.value}
            </Typography>
            <Typography variant="subtitle1">
              Device Name: {selectedDevice.resource.identifier[1]?.value}
            </Typography>
           
          </Stack>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>S.No</TableCell>
                  <TableCell>Critical Alarm</TableCell>
                  <TableCell>Operational Status</TableCell>
                  <TableCell>Last System Change</TableCell>
                  <TableCell>Internal Oximeter</TableCell>
                  <TableCell>Weighing Scale</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedDeviceMetricsHistory
                  .filter((metric) => metric.source.reference === `Device/${selectedDevice.resource.id}`)
                  .map((metric, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{getDisplayValues(metric.type.coding)}</TableCell>
                      <TableCell>{metric.operationalStatus}</TableCell>
                      <TableCell>{metric.meta.lastUpdated}</TableCell>
                      <TableCell>{metric.extension?.find((ext: { url: string }) => ext.url === 'http://example.org/fhir/StructureDefinition/InternalMasimo')?.valueString || 'N/A'}</TableCell>
                      <TableCell>{metric.extension?.find((ext: { url: string }) => ext.url === 'http://example.org/fhir/StructureDefinition/BabyWeighScale')?.valueString || 'N/A'}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </>
  )}
</Box>

      </DialogContent>
    </Dialog>
  );
};

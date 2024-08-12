import React, { useEffect, useState } from 'react';
import { Alert, Snackbar, Stack, Typography, Skeleton, CardContent } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { ServiceDetails } from './ServiceDetails';

interface ServiceCardProps {
  organizationData: {
    id: string;
    name: string;
  };
  darkTheme: boolean;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  organizationData,
  darkTheme,
}) => {
  const [snackSucc, setSnackSucc] = useState(false);
  const [snack, setSnack] = useState(false);
  const [controlColor, setControlColor] = useState('grey');
  const [controlOpacity] = useState('1');
  const [loading, setLoading] = useState(true);
  const [deviceList, setDeviceList] = useState<any[]>([]);
  const [deviceMetrics, setDeviceMetrics] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [deviceStatus, setDeviceStatus] = useState('Normal'); // New state for status

  const handleCloseSnackbar = () => {
    setSnack(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://pmsserver.local/fhir/Device/?_count=100', {
          headers: {
            Authorization: 'Basic ' + btoa('fhiruser:change-password'),
          },
        });
        const data = await response.json();
        setDeviceList(data.entry || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching devices:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // useEffect(() => {
  //   if (deviceMetrics.some((metric) => 
  //     metric.type.coding.some((code: { code: string }) => ['56', '46', '45', '27', '23', '10'].includes(code.code))
  //   )) {
  //     setControlColor('red');
  //   } else {
  //     setControlColor('grey');
  //   }
  // }, [deviceMetrics]);

  useEffect(() => {
    const hasCriticalCode = deviceMetrics.some((metric) => 
      metric.type.coding.some((code: { code: string }) => ['56', '46', '45', '27', '23', '10'].includes(code.code))
    );
    if (hasCriticalCode) {
      setControlColor('red');
      setDeviceStatus('Action Needed');
    } else {
      setControlColor('grey');
      setDeviceStatus('Normal');
    }
  }, [deviceMetrics]);

  return (
    <Box>
      {loading ? (
        <Skeleton animation="wave" variant="rectangular" width={'350px'} height={'280px'} sx={{ borderRadius: '25px' }} />
      ) : (
        <Card
          elevation={5}
          onClick={() => { setIsOpen(true); }}
         
          style={{
            width: '300px',
            opacity: controlOpacity,
            boxShadow: 'none',
            background: darkTheme ? '#1E1D1C' : '#FFFFFF',
            borderRadius: '25px',
            maxHeight: '120px',
            border: `3px solid ${controlColor}`,
          }}
        >
           <Stack width={'100%'} direction={'row'} justifyContent={'center'} textAlign={'center'}>
            <CardContent sx={{ marginTop: '0%', width: '100%', justifyContent: 'left', textAlign: 'center' }}>
              <Typography variant='h6' sx={{ userSelect: 'none', color: darkTheme ? '#FFFFFF' : '#124D81' }}>{organizationData.name}</Typography>
              <Stack spacing={'10%'} marginTop={'5%'} alignItems={'flex-start'}>
                <Typography variant='subtitle1' sx={{ userSelect: 'none', color: darkTheme ? '#FFFFFF' : '#124D81' }}>Status : {deviceStatus}</Typography>
              </Stack>
            </CardContent>
          </Stack>
          <Snackbar open={snack} autoHideDuration={5000} onClose={handleCloseSnackbar}>
            <Alert onClose={handleCloseSnackbar} variant="filled" severity={snackSucc ? 'success' : 'error'}>
              {snackSucc && 'Operation Completed Successfully'}
              {!snackSucc && 'Operation Failed'}
            </Alert>
          </Snackbar>
        </Card>
      )}
      <ServiceDetails
        isOpen={isOpen}
        handleCloseDialog={() => setIsOpen(false)}
        deviceList={deviceList}
        organizationId={organizationData.id}
        setDeviceMetrics={setDeviceMetrics}
        setDeviceStatus={setDeviceStatus} // Pass the setStatus function
      />
    </Box>
  );
};

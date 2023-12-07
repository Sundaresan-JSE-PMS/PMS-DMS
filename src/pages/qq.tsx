import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Skeleton, Stack, Button } from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';
import pmsLogo from '../assets/phx_logo.png';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { PatientCard } from '../components/PatientCard';

type Patient = {
  resourceType: string;
  id: string;
  meta: {
    versionId: string;
    lastUpdated: string;
  };
  extension: {
    url: string;
    valueString: string;
  }[];
  identifier: {
    system: string;
    value: string;
  }[];
};

export const PatientMonitor = (currentRoom: any) => {
  console.log(currentRoom);
  const [patientList, setPatientList] = useState<Patient[] | null>(null);
  const [parentdevice, setParentDevice] = useState<{ [key: string]: any }>({});
  const [parentobs, setParentObs] = useState<{ [key: string]: any }>({});
  const [parentcomm, setParentComm] = useState<{ [key: string]: any }>({});
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const [isLoading, setIsLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);

  const fetchPatients = async (page: number) => {
    const patientDataURL = `http://3.110.169.17:9444/fhir-server/api/v4/Patient?page=${page}&_count=10`;

    const response = await fetch(patientDataURL, {
      credentials: 'omit',
      headers: {
        Authorization: 'Basic ' + btoa('fhiruser:change-password'),
      },
    });

    if (response.ok) {
      const data = await response.json();
      if (data.entry) {
        const patients = data.entry.map((entry: { resource: any }) => entry.resource);
        setPatientList((prevPatients) => (prevPatients ? [...prevPatients, ...patients] : patients));
      }
    }
  };

  const fetchObservations = (patient: { id: any }) => {
    return fetch(
      `http://3.110.169.17:9444/fhir-server/api/v4/Observation?patient=${patient.id}`,
      {
        credentials: 'omit',
        headers: {
          Authorization: 'Basic ' + btoa('fhiruser:change-password'),
        },
      }
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Network response was not ok');
        }
      })
      .catch(handleFetchError);
  };

  const fetchCommunication = (patient: { id: any }) => {
    return fetch(
      `http://3.110.169.17:9444/fhir-server/api/v4/Communication?patient=${patient.id}`,
      {
        credentials: 'omit',
        headers: {
          Authorization: 'Basic ' + btoa('fhiruser:change-password'),
        },
      }
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Network response was not ok');
        }
      })
      .catch(handleFetchError);
  };

  const fetchDevice = (patient: { id: any }) => {
    return fetch(
      `http://3.110.169.17:9444/fhir-server/api/v4/Device?patient=${patient.id}`,
      {
        credentials: 'omit',
        headers: {
          Authorization: 'Basic ' + btoa('fhiruser:change-password'),
        },
      }
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Network response was not ok');
        }
      })
      .catch(handleFetchError);
  };

  const handleFetchError = (error: any) => {
    console.error('Fetch error:', error);
  };

  const fetchDataForPatients = async (patients: any[]) => {
    const tempParentObs: { [key: string]: any[] } = {};
    const tempParentComm: { [key: string]: any[] } = {};
    const tempParentDevice: { [key: string]: any[] } = {};

    setIsLoading(true);

    await Promise.all(
      patients.map(async (patient: { id: any }) => {
        const [observationResponse, communicationResponse, deviceResponse] =
          await Promise.all([
            fetchObservations(patient),
            fetchCommunication(patient),
            fetchDevice(patient),
          ]);

        const pp = String(patient.id);
        tempParentObs[pp] = observationResponse.entry?.map(
          (indiobs: { [x: string]: any }) => indiobs['resource']
        );
        tempParentComm[pp] = communicationResponse.entry?.map(
          (indidev: { [x: string]: any }) => indidev['resource']
        );
        tempParentDevice[pp] = deviceResponse.entry?.map(
          (indidev: { [x: string]: any }) => indidev['resource']
        );
      })
    );

    setIsLoading(false);

    return { tempParentObs, tempParentComm, tempParentDevice };
  };

  useEffect(() => {
    const patientDataURL = 'http://3.110.169.17:9444/fhir-server/api/v4/Patient';
  
    fetch(patientDataURL, {
      credentials: 'omit',
      headers: {
        Authorization: 'Basic ' + btoa('fhiruser:change-password'),
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Network response was not ok');
        }
      })
      .then((data) => {
        if (data.entry) {
          const patients = data.entry.map((entry: { resource: any }) => entry.resource);
          setPatientList(patients);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  
    const socket = new WebSocket('ws://3.110.169.17:9444/fhir-server/api/v4/notification');
  
    socket.onopen = () => {
      console.log('Socket open successful');
    };
  
    socket.onmessage = (data) => {
      var received_data = JSON.parse(data.data);
      if (received_data.location.split('/')[0] === 'Observation') {
        fetch(`http://3.110.169.17:9444/fhir-server/api/v4/${received_data.location}`, {
          credentials: 'omit',
          headers: {
            Authorization: 'Basic ' + btoa('fhiruser:change-password'),
          },
        })
          .then((response) => response.json())
          .then((data) => {
            let tempPatient = String(data.subject?.reference?.split('/')[1]);
            var obsID = String(data.id);
            setParentObs((prevtt) => {
              const tempVar = { ...prevtt };
              if (tempVar[tempPatient]) {
                for (var i = 0; i < tempVar[tempPatient].length; i++) {
                  if (tempVar[tempPatient][i]['id'] === obsID) {
                    tempVar[tempPatient][i] = data;
                    break;
                  }
                }
              }
              return tempVar;
            });
          });
      } else if (received_data.location.split('/')[0] === 'Communication') {
        fetch(`http://3.110.169.17:9444/fhir-server/api/v4/${JSON.parse(data.data).location}`, {
          credentials: 'omit',
          headers: {
            Authorization: 'Basic ' + btoa('fhiruser:change-password'),
          },
        })
          .then((response) => response.json())
          .then((data) => {
            var tempPatient = String(data.subject?.reference?.split('/')[1]);
            var comID = String(data.id);
            setParentComm((prevtt) => {
              const tempVar = { ...prevtt };
              if (tempVar[tempPatient]) {
                for (var i = 0; i < tempVar[tempPatient].length; i++) {
                  if (tempVar[tempPatient][i]['id'] === comID) {
                    tempVar[tempPatient][i] = data;
                    break;
                  }
                }
              }
              return tempVar;
            });
          });
      }
    };
  
    socket.onerror = () => {
      console.log(`Error in socket connection`);
    };
  
    return () => {
      console.log('CLOSE SUCCESS');
      socket.close();
      // Clean up other resources if needed
    };
  }, []);
  

  useEffect(() => {
    if (patientList != null && patientList.length > 0) {
      fetchDataForPatients(patientList)
        .then((result) => {
          setParentObs(result.tempParentObs);
          setParentComm(result.tempParentComm);
          setParentDevice(result.tempParentDevice);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [patientList]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(document.getElementById('infinite-scroll-trigger')!);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    fetchPatients(pageNumber);
  }, [pageNumber]);

  const patientc = patientList?.map((patient) => {
    return (
      <PatientCard
        patient_resource_id={String(patient.id)}
        key={String(patient.id)}
        patient_name={String(patient.extension[0].valueString)}
        patient_id={String(patient.identifier[0].value)}
        device={parentdevice[String(patient.id)]}
        observation_resource={parentobs[String(patient.id)]}
        communication_resource={parentcomm[String(patient.id)]}
      />
    );
  });

  useEffect(() => {
    console.log(parentdevice);
  }, [parentdevice]);

  return (
    <Box display="flex" justifyContent="center" marginTop={'50px'}>
      {isAuthenticated && patientList !== undefined && (
        <div>
          {patientList?.length > 0 ? (
            <Box display={'flex'} flexWrap={'wrap'} justifyContent={'center'} gap={'1rem'}>
              {patientc}
            </Box>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
              {isLoading ? (
                Array.from({ length: 3 }, (_, i) => (
                  <Card key={i} style={{ margin: '10px', width: '250px', borderRadius: '25px' }}>
                    <CardContent>
                      <Typography variant="h5" gutterBottom>
                        <Skeleton animation="wave" width={200} />
                      </Typography>
                      <Typography variant="body1">
                        <Skeleton animation="wave" width={200} />
                      </Typography>
                      <Typography variant="body1">
                        <Skeleton animation="wave" width={120} />
                      </Typography>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Typography variant="h5" gutterBottom>
                  No patients found.
                </Typography>
              )}
            </div>
          )}
          {patientList?.length > 0 && (
            <div id="infinite-scroll-trigger" style={{ height: '10px' }} />
          )}
        </div>
      )}
      {!isAuthenticated && (
        <Stack marginTop={'9%'} justifyContent={'center'} textAlign={'center'} spacing={'40px'} width={'70%'}>
        
          <img src={pmsLogo}  alt="Phoenix"  style={{ maxWidth: '20%',  height: 'auto', // Maintain the aspect ratio
   marginLeft: 'auto',
              marginRight: 'auto',
            }}
          />
          <Typography variant="h3" color={'white'} fontWeight={'50'}>
            NeoLife Sentinel
          </Typography>
          <Typography variant="h6" color={'grey'} fontWeight={'50'}>
            Remote Device Monitoring System
          </Typography>
          <Stack direction={'row'} spacing={'30px'} justifyContent={'space-evenly'}>
            <Button
              variant="outlined"
              sx={{ width: '200px', height: '50px', borderRadius: '100px' }}
              endIcon={<OpenInNewIcon />}
              target="_blank"
              href="https://www.phoenixmedicalsystems.com/"
            >
              Product page
            </Button>
            <Button variant="contained" sx={{ width: '200px', height: '50px', borderRadius: '100px' }} onClick={() => loginWithRedirect()}>
              Sign In
            </Button>
          </Stack>
       
        </Stack>
      )}
    </Box>
  );
};
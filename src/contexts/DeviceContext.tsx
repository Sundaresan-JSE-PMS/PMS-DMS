// import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// interface DeviceData {
//     [key: string]: {
//         communication?: any;
//         observation?: any;
//         pleth?: any;
//         patient?: any;
//     };
// }

// interface DeviceContextProps {
//     devices: any[];
//     deviceData: DeviceData;
//     setDevices: (devices: any[]) => void;
//     updateDeviceData: (deviceId: string, dataType: string, data: any) => void;
// }

// const DeviceContext = createContext<DeviceContextProps>({
//     devices: [],
//     deviceData: {},
//     setDevices: () => {},
//     updateDeviceData: () => {},
// });

// export const useDeviceContext = () => useContext(DeviceContext);

// interface DeviceProviderProps {
//     children: ReactNode;
// }

// export const DeviceProvider: React.FC<DeviceProviderProps> = ({ children }) => {
//     const [devices, setDevices] = useState<any[]>([]);
//     const [deviceData, setDeviceData] = useState<DeviceData>({});
//     const [previousPatientIds, setPreviousPatientIds] = useState<{ [key: string]: string }>({});

//     const updateDeviceData = (deviceId: string, dataType: string, data: any) => {
//         if (dataType === 'patient') {
//             setDeviceData((prevData) => ({
//                 ...prevData,
//                 [deviceId]: {
//                     ...prevData[deviceId],
//                     [dataType]: data,
//                 },
//             }));
//         }
//         else{
//             setDeviceData((prevData) => ({
//                 ...prevData,
//                 [deviceId]: {
//                     ...prevData[deviceId],
//                     [dataType]: data.data,
//                 },
//             }));
//         }
        
//         console.log("DC: ",deviceId, dataType, data);
//         if (dataType === 'observation' && data.patient && previousPatientIds[deviceId] !== data.patient) {
//             setPreviousPatientIds((prevIds) => ({
//                 ...prevIds,
//                 [deviceId]: data.patient,
//             }));
//             fetchPatientData(deviceId, data.patient);
//         }
//     };

//     const fetchPatientData = (deviceId: string, patientId: string) => {
//         fetch(`${import.meta.env.VITE_FHIRAPI_URL as string}/Patient/${patientId}`, {
//             credentials: "omit",
//             headers: {
//                 Authorization: "Basic " + btoa("fhiruser:change-password"),
//             },
//         })
//         .then(response => response.json())
//         .then(data => {
//             updateDeviceData(deviceId, 'patient', data);
//         })
//         .catch(error => {
//             console.error('Error fetching patient data:', error);
//         });
//     };

//     useEffect(() => {
//         console.log("WebSocket URL:", import.meta.env.VITE_STREAMSOCKET_URL);

//         const socket = new WebSocket(`${import.meta.env.VITE_STREAMSOCKET_URL as string}`);

//         socket.onopen = () => {
//             console.log('WebSocket connection established');
//             devices.forEach((device) => {
//                 if (device.deviceId && device.room && device.type) {
//                     socket.send(JSON.stringify({ deviceId: device.deviceId, room: device.room, type: device.type }));
//                 } else {
//                     console.warn('Device with missing information:', device);
//                 }
//             });
//         };

//         socket.onmessage = (event) => {
//             const message = JSON.parse(event.data);
//             console.log("WebSocket Message Received:", message);
//             if (message.type === 'add') {
//                 setDevices(prevDevices => [...prevDevices, message.device]);
//                 fetchPatientData(message.device.deviceId, message.device.patientId);
//             } else if (message.type === 'remove') {
//                 setDevices(prevDevices => prevDevices.filter(d => d.deviceId !== message.device.deviceId));
//             } else {
//                 const { topic, data } = message;
//                 updateDeviceData(data.device_id, topic, data);
//             }
//         };

//         socket.onerror = (error) => {
//             console.error('WebSocket error:', error);
//         };

//         return () => {
//             socket.close();
//         };
//     }, [devices]);

//     useEffect(() => {
//         devices.forEach(device => {
//             if (device.patientId) {
//                 fetchPatientData(device.deviceId, device.patientId);
//             } else {
//                 console.warn('Device with missing patientId:', device);
//             }
//         });
//     }, [devices]);

//     return (
//         <DeviceContext.Provider value={{ devices, deviceData, setDevices, updateDeviceData }}>
//             {children}
//         </DeviceContext.Provider>
//     );
// };


import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface DeviceData {
    [key: string]: {
        communication?: any;
        observation?: any;
        pleth?: any;
        patient?: any;
    };
}

interface DeviceContextProps {
    devices: any[];
    deviceData: DeviceData;
    setDevices: (devices: any[]) => void;
    updateDeviceData: (deviceId: string, dataType: string, data: any) => void;
}

const DeviceContext = createContext<DeviceContextProps>({
    devices: [],
    deviceData: {},
    setDevices: () => {},
    updateDeviceData: () => {},
});

export const useDeviceContext = () => useContext(DeviceContext);

interface DeviceProviderProps {
    children: ReactNode;
}

export const DeviceProvider: React.FC<DeviceProviderProps> = ({ children }) => {
    const [devices, setDevices] = useState<any[]>([]);
    const [deviceData, setDeviceData] = useState<DeviceData>({});
    const [previousPatientIds, setPreviousPatientIds] = useState<{ [key: string]: string }>({});

    /** Function to update device data **/
    const updateDeviceData = (deviceId: string, dataType: string, data: any) => {
        console.log(`Updating device data: DeviceId=${deviceId}, Type=${dataType}, Data=`, data);

        if (dataType === 'patient') {
            setDeviceData((prevData) => ({
                ...prevData,
                [deviceId]: {
                    ...prevData[deviceId],
                    [dataType]: data,
                },
            }));
        } else {
            setDeviceData((prevData) => ({
                ...prevData,
                [deviceId]: {
                    ...prevData[deviceId],
                    [dataType]: data.data,
                },
            }));
        }

        // Check if the patient ID has changed
        if (dataType === 'observation' && data.patient && previousPatientIds[deviceId] !== data.patient) {
            console.log(`New patient detected for device ${deviceId}. Fetching patient data.`);
            setPreviousPatientIds((prevIds) => ({
                ...prevIds,
                [deviceId]: data.patient,
            }));
            fetchPatientData(deviceId, data.patient);
        }
    };

    /** Function to fetch patient data from the FHIR API **/
    const fetchPatientData = (deviceId: string, patientId: string) => {
        console.log(`Fetching patient data: DeviceId=${deviceId}, PatientId=${patientId}`);

        fetch(`${import.meta.env.VITE_FHIRAPI_URL as string}/Patient/${patientId}`, {
            credentials: "omit",
            headers: {
                Authorization: "Basic " + btoa("fhiruser:change-password"),
            },
        })
        .then(response => response.json())
        .then(data => {
            console.log(`Fetched patient data for ${deviceId}:`, data);
            updateDeviceData(deviceId, 'patient', data);
        })
        .catch(error => {
            console.error(`Error fetching patient data for ${deviceId}:`, error);
        });
    };

    /** Effect: Handles WebSocket connection **/
    useEffect(() => {
        console.log("Initializing WebSocket...");
        console.log("WebSocket URL:", import.meta.env.VITE_STREAMSOCKET_URL);

        const socket = new WebSocket(`${import.meta.env.VITE_STREAMSOCKET_URL as string}`);

        socket.onopen = () => {
            console.log('✅ WebSocket connection established');
            devices.forEach((device) => {
                if (device.deviceId && device.room && device.type) {
                    console.log(`Sending device info to WebSocket:`, device);
                    socket.send(JSON.stringify({ deviceId: device.deviceId, room: device.room, type: device.type }));
                } else {
                    console.warn('⚠️ Device with missing information:', device);
                }
            });
        };

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log("📩 WebSocket Message Received:", message);

            if (message.type === 'add') {
                console.log(`➕ Adding new device:`, message.device);
                setDevices(prevDevices => [...prevDevices, message.device]);
                fetchPatientData(message.device.deviceId, message.device.patientId);
            } else if (message.type === 'remove') {
                console.log(`❌ Removing device:`, message.device);
                setDevices(prevDevices => prevDevices.filter(d => d.deviceId !== message.device.deviceId));
            } else {
                console.log(`🔄 Updating device data:`, message);
                const { topic, data } = message;
                updateDeviceData(data.device_id, topic, data);
            }
        };

        socket.onerror = (error) => {
            console.error('❗ WebSocket error:', error);
        };

        socket.onclose = (event) => {
            console.warn(`⚠️ WebSocket closed. Reason: ${event.reason}`);
        };

        return () => {
            console.log("🛑 Closing WebSocket connection...");
            socket.close();
        };
    }, [devices]);

    /** Effect: Fetch patient data when devices change **/
    useEffect(() => {
        console.log("🔄 Checking for devices to fetch patient data...");
        devices.forEach(device => {
            if (device.patientId) {
                console.log(`Fetching patient data for device: ${device.deviceId}`);
                fetchPatientData(device.deviceId, device.patientId);
            } else {
                console.warn('⚠️ Device with missing patientId:', device);
            }
        });
    }, [devices]);

    return (
        <DeviceContext.Provider value={{ devices, deviceData, setDevices, updateDeviceData }}>
            {children}
        </DeviceContext.Provider>
    );
};

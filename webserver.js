import { Kafka } from "kafkajs";
import WebSocket from "ws";
import express from "express";
import axios from "axios";
import https from "https";
import cors from "cors";
import fs from "fs";
import path from "path";


const kafka = new Kafka({
    clientId: "websocket-consumer",
    brokers: ["kafka:9093"],
    ssl: {
        rejectUnauthorized: false,
        ca: [
            fs.readFileSync(
                path.resolve(__dirname, "secrets/ca-cert.pem"),
                "utf-8"
            ),
        ],
        key: fs.readFileSync(
            path.resolve(__dirname, "secrets/kafka.server.key.pem"),
            "utf-8"
        ),
        cert: fs.readFileSync(
            path.resolve(__dirname, "secrets/kafka.server.cert.pem"),
            "utf-8"
        ),
    },
});

const consumer = kafka.consumer({ groupId: "websocket-group" });

const wss = new WebSocket.Server({ port: 8080 });

let clients = {};
let activeDevices = new Map();

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors()); // Enable CORS

// Configure Axios to ignore self-signed certificates and use Basic Auth
const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
});

const axiosInstance = axios.create({
    httpsAgent,
    auth: {
        username: "fhiruser", // Replace with your username
        password: "change-password", // Replace with your password
    },
});

// Transform device data to match the expected format
const transformDeviceData = (device) => {
    const identifiers = device.identifier;
    const macId = identifiers.find(
        (id) => id.system === "urn:ietf:rfc:3986" && id.value.includes(":")
    ).value;
    const type = identifiers.find(
        (id) => id.system === "urn:ietf:rfc:3986" && !id.value.includes(":")
    ).value;
    const roomReference = device.location ? device.location.reference : null;
    const patientReference = device.patient
        ? device.patient.reference.split("/")[1]
        : null;
    return {
        deviceId: device.id,
        macId,
        type,
        room: roomReference ? roomReference.split("/")[1] : null,
        patientId: patientReference,
    };
};

// Fetch the list of devices from the FHIR server
const fetchDevices = async () => {

    try {

        // Request up to 100 devices in a single page

        const response = await axiosInstance.get(

            `${process.env.FHIR_SERVER_URL}/Device?_count=100`

        );



        // Transform each device resource from the response

        const devices = response.data.entry.map((entry) =>

            transformDeviceData(entry.resource)

        );



        console.log("Fetched devices:", devices);

        return devices;

    } catch (error) {

        console.error("Error fetching devices:", error);

        return [];

    }

};



// Broadcast device updates
const broadcastDeviceUpdate = (type, device) => {
    const message = JSON.stringify({ type, device });
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
};

// Endpoint to handle device addition
const pendingDevices = new Map();



app.post("/addDevice", (req, res) => {

    const { deviceId } = req.body;



    axiosInstance

        .get(`${process.env.FHIR_SERVER_URL}/Device/${deviceId}`)

        .then((response) => {

            const device = transformDeviceData(response.data);

            pendingDevices.set(deviceId, device); // Store device temporarily

            broadcastDeviceUpdate("add", device);

            res.status(201).send(device);

        })

        .catch((error) => {

            console.error("Error fetching device data:", error);

            res.status(500).send("Error fetching device data");

        });

});



// Endpoint to handle device removal
app.post("/removeDevice", (req, res) => {
    const { deviceId } = req.body;
    // Logic to remove the device (e.g., delete from database)
    broadcastDeviceUpdate("remove", { deviceId });
    res.status(200).send();
});

// Endpoint to get devices filtered by room
app.get("/devices", async (req, res) => {
    const room = req.query.room;
    const devices = await fetchDevices();
    if (room) {
        const devicesInRoom = devices.filter((device) => device.room === room);
        res.json(devicesInRoom);
    } else {
        res.json(devices);
    }
});

wss.on("connection", (ws) => {
    ws.on("message", (message) => {
	 console.log("WebSocket message received:", message);
        try {
            const parsedMessage = JSON.parse(message);
            const { deviceId, room, type } = parsedMessage;
            if (!deviceId || !room || !type) {
                throw new Error("Invalid message format");
            }
            if (!clients[deviceId]) {
                clients[deviceId] = [];
            }
            clients[deviceId].push(ws);
            activeDevices.set(deviceId, { deviceId, room, type });
        } catch (error) {
            console.error("Invalid JSON or message format:", error);
            ws.send(JSON.stringify({ error: "Invalid message format" }));
        }
    });

    ws.on("close", () => {
        for (let deviceId in clients) {
            clients[deviceId] = clients[deviceId].filter(
                (client) => client !== ws
            );
            if (clients[deviceId].length === 0) {
                delete clients[deviceId];
                activeDevices.delete(deviceId);
            }
        }
    });
});

const run = async () => {
    await consumer.connect();
    await consumer.subscribe({ topic: "observation", fromBeginning: false });
    await consumer.subscribe({ topic: "communication", fromBeginning: false });
    await consumer.subscribe({ topic: "pleth", fromBeginning: false });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            try {
                const deviceData = JSON.parse(message.value.toString());
                const { device_id } = deviceData;

                if (!device_id) {
                    throw new Error("Invalid message format");
                }

                if (clients[device_id]) {
                    clients[device_id].forEach((ws) => {
                        if (ws.readyState === WebSocket.OPEN) {
                            ws.send(
                                JSON.stringify({ topic, data: deviceData })
                            );
                        }
                    });
                } else {
                    console.error(`No clients for device_id ${device_id}`);
                }
            } catch (error) {
                console.error("Error processing message:", error);
            }
        },
    });
};

run().catch(console.error);

app.listen(port, () => {
    console.log(`Device service listening at http://localhost:${port}`);
});

console.log("WebSocket server is listening on ws://localhost:8080");

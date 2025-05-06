import axios from 'axios';
import https from 'https';

// Basic authentication credentials
const AUTH_USERNAME = 'fhiruser';
const AUTH_PASSWORD = 'change-password';

// Axios instance with common configuration
const axiosInstance = axios.create({
    baseURL: 'https://pmsserver.local/fhir',
    httpsAgent: new https.Agent({ rejectUnauthorized: false }), // Disable SSL verification
    auth: {
        username: AUTH_USERNAME,
        password: AUTH_PASSWORD,
    },
    headers: {
        'Content-Type': 'application/json',
    },
});

// Step 1: Fetch all Observation resources
async function fetchObservations() {
    try {
        const response = await axiosInstance.get(`/Observation?_count=1000`);
        return response.data.entry || [];
    } catch (error) {
        console.error('Error fetching observations:', error.response?.data || error.message);
        return [];
    }
}

// Step 2: Filter observations with meta.versionId = "1"
function filterObservations(observations) {
    return observations.filter(observation => {
        const resource = observation.resource;

        // Ensure the resource has meta.versionId and check if it equals "1"
        return resource.meta?.versionId === "1";
    });
}

// Step 3: Send a batch delete request for the filtered observations
async function deleteObservations(filteredObservations) {
    if (filteredObservations.length === 0) {
        console.log('No matching observations found for deletion.');
        return;
    }

    const batchRequest = {
        resourceType: 'Bundle',
        type: 'batch',
        entry: filteredObservations.map(observation => ({
            request: {
                method: 'DELETE',
                url: `Observation/${observation.resource.id}`,
            },
        })),
    };

    try {
        const response = await axiosInstance.post('/', batchRequest);
        console.log('Batch deletion successful!', response.data);
    } catch (error) {
        console.error('Error deleting observations:', error.response?.data || error.message);
    }
}

// Main function
async function main() {
    console.log('Fetching observations...');
    const observations = await fetchObservations();

    console.log(`Total observations fetched: ${observations.length}`);
    const filteredObservations = filterObservations(observations);
    console.log(`Observations to delete: ${filteredObservations.length}`);

    await deleteObservations(filteredObservations);
}

// Run the script
main().catch(err => console.error('Error in script:', err));

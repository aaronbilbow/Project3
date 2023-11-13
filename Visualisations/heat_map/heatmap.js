// Initialize the map
const map = L.map('map').setView([0, 0], 2); // Set initial view (lat, lon, zoom)

// Add the tile layer (OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Fetch data from the CSV file
fetch('merged_data1.csv')
    .then(response => response.text())
    .then(csvData => {
        // Parse CSV data
        const chargingStations = parseCSV(csvData);

        // Convert charging stations to heat data, filtering out invalid coordinates
        const heatData = chargingStations
            .map(station => [parseFloat(station.Latitude), parseFloat(station.Longitude)])
            .filter(coords => !isNaN(coords[0]) && !isNaN(coords[1]));

        // Check if there are valid latitude and longitude values
        console.log(heatData);

        // Add heatmap layer only if there are valid coordinates
        if (heatData.length > 0) {
            L.heatLayer(heatData, { radius: 25 }).addTo(map);
        } else {
            console.error('No valid coordinates found.');
        }
    })
    .catch(error => console.error('Error loading CSV file:', error));

// Function to parse CSV data
function parseCSV(csvData) {
    const lines = csvData.split('\n');
    const headers = lines[0].split(',');

    const result = [];

    for (let i = 1; i < lines.length; i++) {
        const data = lines[i].split(',');
        const station = {};

        for (let j = 0; j < headers.length; j++) {
            station[headers[j]] = data[j];
        }

        result.push(station);
    }

    return result;
}

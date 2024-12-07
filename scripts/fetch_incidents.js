// Function to fetch incidents from fetch_incidents.php
async function fetchIncidents() {
    try {
        // Make a GET request to fetch_incidents.php
        const response = await fetch('fetch_incidents.php');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Parse the JSON response
        const incidents = await response.json();

        // Select the container element
        const container = document.getElementById('incidentContainer');
        container.innerHTML = ''; // Clear existing content

        // Loop through the incidents and create HTML for each
        incidents.forEach(incident => {
            const div = document.createElement('div');
            div.classList.add('incident');
            
            div.innerHTML = `
                <p><strong>ID:</strong> ${incident.id}</p>
                <p><strong>Description:</strong> ${incident.description}</p>
                <p><strong>Classification:</strong> ${incident.classification}</p>
                <p><strong>Urgency Level:</strong> ${incident.urgency_level}</p>
                <p><strong>Location:</strong> ${incident.location}</p>
                <p><strong>Time:</strong> ${incident.time}</p>
                ${incident.media_url ? `<img src="${incident.media_url}" alt="Incident Media" style="max-width: 300px;">` : ''}
            `;
            container.appendChild(div);
        });
    } catch (error) {
        console.error('Error fetching incidents:', error);
    }
}

// Call fetchIncidents when the page loads
document.addEventListener('DOMContentLoaded', fetchIncidents);

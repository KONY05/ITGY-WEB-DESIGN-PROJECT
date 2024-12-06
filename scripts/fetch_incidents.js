document.addEventListener('DOMContentLoaded', () => {
    fetch('fetch_incidents.php')
        .then(response => response.json())
        .then(data => {
            const incidentContainer = document.getElementById('incidentContainer');
            data.forEach(incident => {
                const div = document.createElement('div');
                div.className = 'incident';
                div.innerHTML = `
                    <p><strong>ID:</strong> ${incident.id}</p>
                    <p><strong>Description:</strong> ${incident.description}</p>
                    <p><strong>Classification:</strong> ${incident.classification}</p>
                    <p><strong>Urgency Level:</strong> ${incident.urgency_level}</p>
                    <p><strong>Location:</strong> ${incident.location}</p>
                `;
                if (incident.media_url) {
                    div.innerHTML += `<img src="${incident.media_url}" alt="Incident Media" style="max-width: 300px;">`;
                }
                incidentContainer.appendChild(div);
            });
        });
});

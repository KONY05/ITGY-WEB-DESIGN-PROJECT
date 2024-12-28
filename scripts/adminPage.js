'use strict';

const tableBody = document.querySelector('tbody');
const urgency = document.querySelector('.urgency');

let jsonData = []; // To store all incidents initially

async function fetchIncidents() {
    try {
        const response = await fetch('http://localhost/ITGY401PROJECT/api/fetch_incidents.php');

        if (!response.ok) {
            throw new Error(`Error fetching incidents: ${response.status}`);
        }

        const data = await response.json();
        jsonData = data; // Store fetched data in jsonData

        insertIncidents(jsonData); // Display all incidents initially
    } catch (error) {
        console.error("Error occurred while fetching incidents: ", error.message);
    }
}

function insertIncidents(incidents) {
    // Clear the table before inserting new rows
    tableBody.innerHTML = '';

    const capitalizeFirstLetter = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    // Loop through the incidents array to create table rows
    incidents.forEach(el => {
        const num = el.id; // Assuming el.id is a number
        const id = String(num).padStart(3, '0'); // Pad the ID with leading zeros
        const html = `<tr>
                    <td>${id}</td>
                    <td>${el.created_at}</td>
                    <td>${el.location}</td>
                    <td>${el.urgency_level}</td>
                    <td class="desc">${el.description}</td>
                    <td>
                      <button class="deleteBtn" data-id=${el.id}>Delete</button>
                    </td>
                  </tr>`;

        tableBody.insertAdjacentHTML('beforeend', html);
    });
}

function filterByCategory(e) {
    const selectedValue = e.target.value; // Get the selected urgency level

    let filteredIncidents;

    if (selectedValue === 'all_incidents') {
        // If "All Incidents" is selected, display all incidents
        filteredIncidents = jsonData;
    } else {
        // Otherwise, filter based on the selected urgency level
        filteredIncidents = jsonData.filter(
            (incident) => incident.urgency_level === selectedValue
        );
    }

    console.log(`Filtered incidents for ${selectedValue}:`, filteredIncidents);

    // Update the table with filtered incidents
    insertIncidents(filteredIncidents);
}

async function deleteIncident(e){
    if (e.target.classList.contains('deleteBtn')) {
      const incidentId = e.target.dataset.id;
  
      // Confirm before deleting
      if (confirm('Are you sure you want to delete this product?')) {
        try {
          // Send DELETE request to the backend
          const response = await fetch('http://localhost/ITGY401PROJECT/api/delete_incident.php', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json', // Set the content type to JSON
            },
            body: JSON.stringify({id: incidentId}), // Pass the incident ID as JSON in the request body
          });
          // console.log(response);
          
          
          // // Check for a successful response
          if (!response.ok) {
            throw new Error('Failed to delete product: ' + response.statusText);
          }
  
          // // Parse the JSON response
          const data = await response.json();
          console.log(data);
          
          console.log('hello');
  
          if (data.status === 200) {
            console.log('Product deleted successfully:', data.message);
            alert('Product deleted successfully!');
            fetchIncidents(); // Reload the incident table to reflect the deletion
          } else {
            console.error('Error deleting product:', data.message);
            alert('Error deleting product: ' + data.message);
          }
        } catch (error) {
          console.error('Error deleting product:', error);
          alert('An error occurred while trying to delete the product. Please try again.');
        }
     }
  }
}

tableBody.addEventListener('click', deleteIncident);
  

// Call the fetch function to load all incidents initially
fetchIncidents();

// Add the event listener to the select element for filtering
urgency.addEventListener('change', filterByCategory);

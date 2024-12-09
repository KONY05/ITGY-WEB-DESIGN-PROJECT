'use strict';

// INPUT VARIABLES
const description = document.querySelector('#description');
const classification = document.querySelector('.classify');
const sus_activity = document.querySelector('#activity_type');
const urgency = document.querySelector('.urgency');
const userLocation = document.querySelector('#location');
const time = document.querySelector('.time');
const media = document.querySelector('.media');

// SUBMIT BUTTON
const submitBtn = document.querySelector('#submit');

// REPORT VALUES
const reportContainer = document.querySelector('.reports');
const reportDesc = document.querySelector('.rep_desc');
const reportClass = document.querySelector('.rep_desc');
const reportUrgency = document.querySelector('.rep_urg');
const reportLocation = document.querySelector('.rep_loc');
const reportTime = document.querySelector('.rep_time');

// COUNTER VARIABLES
const counterUp = document.querySelector('#counterUp');
const counterDown = document.querySelector('#counterDown');

class ApplicatonPage{
    constructor(){
        this._getLocation();
        submitBtn.addEventListener('click', this._confirmReport.bind(this));
        classification.addEventListener('change', this._showSusActivity.bind(this));
        description.addEventListener('keydown', this._counter);
        document.querySelector('body').addEventListener('keydown', this._buttonClick.bind(this));
    };

    _confirmReport(e) {
        e.preventDefault();
    
        // Validate fields
        const confirmSusActivityOpen = () => !sus_activity.classList.contains('hidden') && !sus_activity.value.trim() ? true: false;

        if (!description.value.trim() || confirmSusActivityOpen()) {
            alert('Please complete all fields before submitting');
            return;
        }
    
        // If all fields are filled, you can proceed
        this._insertIncidents();
        console.log(description.value, media.value, classification.value, urgency.value, userLocation.value, time.value);
        
        this._postIncidents({description: description.value, media: media.value, classification: classification.value, urgency_level: urgency.value, location: userLocation.value, time: time.value});
        this._clearForm();
        console.log('Form submitted successfully');
    }

    async _postIncidents(data = {}){
        try {
            const url = 'http://localhost/ITGY401PROJECT/api/submit_incident.php'
            const response = await fetch(url, {
              method: 'POST', // HTTP method
              headers: {
                'Content-Type': 'application/json' // Specify the content type
              },
              body: JSON.stringify(data) // Convert data to JSON string
            });
        
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
        
            const result = await response.json(); // Parse JSON response
            console.log('Success:', result);
            return result;
          } catch (error) {
            console.error(`An error occured, ${error.message}`);
            alert(`An error occured while submitting your incident: ${error.message}`);
          }
    }

    _buttonClick(e){
        // Check if the Enter key was pressed
        if (e.key === 'Enter') {
            this._confirmReport(e);
        }
    }

    _counter(){
        const length = description.value.length;
        
        const end = 150 - length; // Calculate remaining characters
        counterUp.textContent = length; // Update the characters input count
        counterDown.textContent = end; // Update the characters remaining count
    
        // Conditional styling based on input length
        if (length >= 100) {
            counterUp.style.color = "red"; // Change counterUp to red when nearing the limit
        
            if (length >= 150) {
                counterUp.style.color = "rgb(16, 230, 16)"; // Change color of counterUp to green
                counterDown.style.color = "red"; // Change color of counterDown to red
            } else {
                counterDown.style.color = ""; // Reset color
            }
        } else {
            counterUp.style.color = ""; // Reset color
            counterDown.style.color = ""; // Reset color
        }
    }

    _clearForm(){
        description.value = '';
        media.value = '';
        // userLocation.value = '📍';
        sus_activity.value = '';
        classification.value = 'terrorism';
        urgency.value = 'critical';

        sus_activity.classList.add('hidden')

        counterDown.textContent = 150; 
        counterUp.textContent = 0;
    }

    async _getLocation() {
        try {
            // Check if geolocation is available
            if (!navigator.geolocation) {
                throw new Error("Geolocation is not supported by your browser.");
            }
    
            // Get user's current location
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            });
    
            const { latitude, longitude } = position.coords;
            // console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
    
            // Reverse Geocode the coordinates to get a human-readable address
            const apiKey = "c7420bcf4ea944249a1781183cc9754d";
            const geocodingUrl = `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=${apiKey}`;
    
            const response = await fetch(geocodingUrl);
    
            if (!response.ok) {
                throw new Error(`Geocoding API returned an error: ${response.status}`);
            }
    
            const data = await response.json();
            // console.log(data);
            
    
            if (data.features && data.features.length > 0) {
                const address = data.features[0].properties.formatted;
                // console.log("User's location:", address);
                // alert(`You are at: ${address}`);
                userLocation.value = '';
                userLocation.value = `📍 ${address}`;
            } else {
                throw new Error("No address found in the geocoding API response.");
            }
        } catch (error) {
            console.error("An error occurred:", error.message);
            alert(`Error: ${error.message}`);
        }
    }

    _insertIncidents(){
        const capitalizeFirstLetter = (str) => {
            return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
        };
        
        const html = `<div class="report">
                            <div class="report_info">
                                <p class="rep_desc"><strong>Description:</strong> <span>${capitalizeFirstLetter(description.value)}</span></p>
                                <p><strong>Classification:</strong> <span class="rep_class">${sus_activity.classList.contains('hidden') ? capitalizeFirstLetter(classification.value): capitalizeFirstLetter(sus_activity.value)}</span></p>
                                <p><strong>Urgency Level:</strong> <span class="rep_urg ${urgency.value == 'critical' ? 'critical': urgency.value == 'low' ? 'low': urgency.value == 'moderate' ? 'moderate': 'blackCl'}">${capitalizeFirstLetter(urgency.value)}</span></p>
                                <p class="rep_loc"><strong>Location:</strong> <span>${capitalizeFirstLetter(userLocation.value)}</span></p>
                                <p><strong>Time:</strong> <span class="rep_time">${capitalizeFirstLetter(time.value)} - ${this._formatDate()}</span></p>
                            </div>
                        </div>`;
        

        reportContainer.insertAdjacentHTML('afterbegin', html);
    }

    _formatDate(){
        const date = new Date();
        
        const calcDaysPassed = (date1, date2) =>
            Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
        
          const daysPassed = calcDaysPassed(new Date(), date);
        //   console.log(daysPassed);
        
          if (daysPassed === 0) return "Today";
          if (daysPassed === 1) return "Yesterday";
          if (daysPassed <= 7) return `${daysPassed} days ago`;
        
          return new Intl.DateTimeFormat(locale).format(date);
    }

    _showSusActivity(e){
        if(e.target.value === "suspicious activity"){
            sus_activity.classList.remove('hidden')
        }else{
            sus_activity.classList.add('hidden')
        }
    }

}

const app = new ApplicatonPage();
'use strict';

const userLocation = document.querySelector('#loc_area');

const buttons = document.querySelector('.bottom_btns');
const verifyBtn = document.querySelector('.verify');
const addInfo_btns = document.querySelectorAll('.add_info');

const cancelBtn = document.querySelector('.cancelBtn');
const closeBtn = document.querySelector('.closeBtn');
const overlay = document.querySelector('.overlay');
const popup = document.querySelector('.addInfo_modalView');
const textarea = document.querySelector('#addInfo_modal');

const incidentsContainer = document.querySelector('.incidentContainer');

let jsonData;

class IncidentPage{
    // Declare class properties outside the constructor
    text = "✓ Information added"; // Default text
    words = this.text.split(" "); // Split text into words
    activeTextElements = new Map(); // Map to track active text elements

    constructor(){
        // Initialize the last clicked button
        this.lastClickedButton = null;

        this._getLocation();
        this._getIncidents();

        [cancelBtn, overlay].forEach(el => el.addEventListener('click', this._closePopUp.bind(this)));

        // Bind the close button to handle the modal close and text creation
        closeBtn.addEventListener('click', this._handleModalClose.bind(this));

        // Event delegation for dynamically created elements
        incidentsContainer.addEventListener('click', this._incidentsContainerHandler.bind(this));
    }

    _incidentsContainerHandler(e){
            if (e.target.classList.contains('add_info')) {
                this.lastClickedButton = e.target;
            }

            if (e.target.classList.contains('verify')) {
                this._verifyAlert(e);
            }

            if (e.target.classList.contains('add_info')) {
                this._openPopUp(e);
            }
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
    
            if (data.features && data.features.length > 0) {
                const address = data.features[0].properties['address_line1'];
                // console.log("User's location:", address);
                // alert(`You are at: ${address}`);
                userLocation.innerHTML = '';
                userLocation.innerHTML = `📍 ${address}`;
            } else {
                throw new Error("No address found in the geocoding API response.");
            }
        } catch (error) {
            console.error("An error occurred:", error.message);
            alert(`Error: ${error.message}`);
        }
    }

    async _getIncidents(){
        try {
            const response = await fetch('https://localhost/ITGY401PROJECT/api/fetch_incidents.php');

            if (!response.ok) {
                throw new Error(`Error fetching incidents: ${response.status}`);
            }

            const data = await response.json();
            jsonData = data;
            
            this._insertIncident();

        } catch (error) {
            console.error("Error occured while fetching incidents", error.message);
        }
    }

    _insertIncident(){
        // console.log(jsonData);
        
        const date = new Date();
        
        jsonData.forEach(el => {
            const html = `<div class="incident">
            <p class="inc_head">${el.classification}</p>
            <p class="inc_loc">${el.location}</p>
            <p class="inc_time">${this._calcTimeDifference(date, el.created_at)}</p>
            <p class="inc_urg ${el.urgency_level}">urgency: <span>${el.urgency_level}</span></p>

            <div class="bottom_btns">
                <button class="verify">verify</button>
                <button class="add_info">add information</button>
            </div>
        </div>`;
    
        incidentsContainer.insertAdjacentHTML('beforeend', html);
        });
    }

    _calcTimeDifference(currentDate, targetDate){
         // Parse the target date string into a Date object
        const target = new Date(targetDate)
        
        // Calculate the difference in milliseconds
        const diffInMs = Math.abs(currentDate - target);
        
        // Convert milliseconds to minutes, hours, and days
        const diffInMinutes = Math.round(diffInMs / (1000 * 60));
        const diffInHours = Math.round(diffInMs / (1000 * 60 * 60));
        const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24));
        
        // Determine the most appropriate unit to return
        if (diffInMinutes < 60) {
            return `Reported ${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
        } else if (diffInHours < 24) {
            return `Reported ${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
        } else {
            return `Reported ${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
        }
    }

    _openPopUp(){
        document.querySelector('body').classList.add('body_overlay');
        overlay.classList.remove('hidden');
        popup.classList.remove('hidden');
    }

    _closePopUp(){
        document.querySelector('body').classList.remove('body_overlay');
        overlay.classList.add('hidden');
        popup.classList.add('hidden');
        textarea.value = '';
    }
      
    _handleModalClose() {
        // Check if there's input in the textarea
        const inputText = textarea.value.trim();

        if (!inputText) return; // Exit if no text is entered

        // Check if a valid button was clicked before the modal opened
        if (!this.lastClickedButton) return;

        // Check if text already exists for the button
        if (this.activeTextElements.has(this.lastClickedButton)) {
            // Remove the existing text element to allow new text creation
            const existingElement = this.activeTextElements.get(this.lastClickedButton);
            existingElement.remove();
            this.activeTextElements.delete(this.lastClickedButton);
        }

        // Create and append the new text element next to the "Add Info" button
        const textElement = document.createElement("div");
        textElement.className = "added_info";
        this.lastClickedButton.insertAdjacentElement("afterend", textElement);

        // Store the reference to the text element
        this.activeTextElements.set(this.lastClickedButton, textElement);

        // Start animating the text
        this._animateText(textElement);

        // Close modal
        this._closePopUp();

        // Clear the textarea for new input
        textarea.value = '';
    }

    _animateText(textElement) {
        let index = 0; // Track the current word position

        const showWord = () => {
            if (index < this.words.length) {
                // Create a span for the next word
                const wordSpan = document.createElement("span");
                wordSpan.textContent = (index === 0 ? "" : " ") + this.words[index];
                wordSpan.style.opacity = 0; // Start with 0 opacity
                wordSpan.style.transition = "opacity 0.5s ease-in-out"; // Fade-in effect
                textElement.appendChild(wordSpan);

                // Trigger fade-in animation
                setTimeout(() => {
                    wordSpan.style.opacity = 1;
                }, 50);

                index++;
                setTimeout(showWord, 500); // Show the next word after 500ms
            }
        };

        showWord(); // Start the animation
    }

    _verifyAlert(){
        alert('Thank you for verifying this incident. Your input helps others asses the situation more accurately');
    }


}

const incident = new IncidentPage();
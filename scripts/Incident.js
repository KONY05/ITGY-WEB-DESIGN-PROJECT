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

class IncidentPage{
    // Declare class properties outside the constructor
    text = "✓ Information added"; // Default text
    words = this.text.split(" "); // Split text into words
    activeTextElements = new Map(); // Map to track active text elements

    constructor(){
        // this._getLocation();
        addInfo_btns.forEach(button => 
            button.addEventListener('click', this._openPopUp.bind(this)));

        [cancelBtn, overlay].forEach(el => 
            el.addEventListener('click', this._closePopUp.bind(this)));

        // Bind the close button to handle the modal close and text creation
        closeBtn.addEventListener('click', this._handleModalClose.bind(this));

        // Store the button last clicked in the NodeList
        this.lastClickedButton = null;

        // Add event listeners to all "Add Info" buttons to track the clicked button
        addInfo_btns.forEach((button) =>
            button.addEventListener('click', (e) => {
                this.lastClickedButton = e.target;
            })
        );

        verifyBtn.addEventListener('click', this._verifyAlert.bind(this));
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
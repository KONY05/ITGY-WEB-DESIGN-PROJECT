'use strict';

// Select DOM elements
const username = document.querySelector('#username');
const password = document.querySelector('#password');
const loginBtn = document.querySelector('.login-btn');
const formerHeader = document.querySelector('.header');
const checkbox = document.querySelector('#show-password'); // Checkbox for toggling password visibility

async function checkDb(username, password) {
    try {
        // Log values before sending
        console.log('Username:', username);
        console.log('Password:', password);

        // Ensure you're sending a POST request
        const response = await fetch('https://localhost/ITGY401PROJECT/api/login.php', {
            method: 'POST',  // POST method
            headers: {
                'Content-Type': 'application/json'  // Sending JSON data
            },
            body: JSON.stringify({ username: username, password: password })  // Sending the login data
        });

        if (!response.ok) {
            throw new Error(`Could not verify user: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);

        if (data.success) {
            localStorage.setItem('user', JSON.stringify(data.userData));
            window.location.href = data.redirectUrl;
        } else {
            alert(data.message || 'Login failed. Please try again.');
        }
    } catch (error) {
        console.error("An error occurred:", error.message);
        alert('An error occurred while processing your request.');
    }
}


// Add event listener to the login button
loginBtn.addEventListener('click', (event) => {
    event.preventDefault(); // Prevent the form from submitting traditionally

    const user = username.value.trim();
    const pass = password.value.trim();

    if (user && pass) {
        checkDb(user, pass); // Call the API function
    } else {
        alert('Please enter both username and password.');
    }
});

// Function to check if the user is logged in by looking in localStorage
function checkUserState() {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user) {
        console.log(`Logged in as ${user.username}, Role: ${user.role}`);
        // Update the header or perform actions based on user role
        const headerHTML = `
            <header class="header">
                <a href="HomePage.html" target="_blank"><img src="img/logo.png" alt="AlertNet Logo" id="logoImg"></a>
                <nav class="nav">
                    <a href="HomePage.html" target="_self">Home</a>
                    <a href="AboutPage.html" target="_self">About</a>
                    <a href="SafetyTipsPage.html" target="_self">Safety Tips</a>
                    <a href="IncidentsPage.html" target="_self">Incidents</a>
                </nav>
                <div class="userSec">
                    <img src="img/dummy profileImg.png" alt="">
                    <span>Welcome, ${user.username})</span>
                </div>
            </header>
        `;

        document.body.insertAdjacentHTML('afterbegin', headerHTML);
    } else {
        console.log('No user is logged in.');
    }
}

// Call checkUserState on page load to check if the user is logged in
window.addEventListener('DOMContentLoaded', checkUserState);

// Function to toggle password visibility
function togglePasswordVisibility() {
    // Check if the checkbox is checked
    if (checkbox.checked) {
        // Show the password
        password.type = 'text';
    } else {
        // Hide the password
        password.type = 'password';
    }
}

// Add event listener to the checkbox to toggle password visibility
checkbox.addEventListener('change', togglePasswordVisibility);
'use strict';

const username = document.querySelector('#username');
const email = document.querySelector('#email');
const firstPassword = document.querySelector('#firstPass');
const password = document.querySelector('#password');

function confirmPassword(){
    if(password.value !== firstPassword.value){
        alert('Please input the correct password');
        
    }else{
        sendInfo({username: username.value, email: email.value, password: password.value});
    }
}

async function sendInfo(data = {}){
    try {
        const url = 'http://localhost/ITGY401PROJECT/api/signup.php'
        const response = await fetch(url, {
          method: 'POST', // HTTP method
          headers: {
            'Content-Type': 'application/json' // Specify the content type
          },
          body: JSON.stringify(data) // Convert data to JSON string
        });
    
        if (!response.ok) {
            throw new Error(`Error signing in user: ${response.status}`);
        }
    
        const result = await response.json(); // Parse JSON response
        console.log('Success:', result);
        return result;
    } catch (error) {
        console.error("Error occured while signing up", error.message);
    }
}
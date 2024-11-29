document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('newsletter-form').addEventListener('submit', async function(event) {
        event.preventDefault(); 

        const email = document.getElementById('emailnewsletter').value.trim(); // Use .trim() to clean whitespace
        const responseMessageDiv = document.getElementById('response-message');


        if (!email) {
            responseMessageDiv.textContent = 'Please enter an email address.';
            responseMessageDiv.style.color = 'red';
            return; 
        }

        try {
            const response = await fetch('newsletter/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }) 
            });

            const data = await response.json();

            if (response.ok) {
                responseMessageDiv.textContent = data.message; 
                responseMessageDiv.style.color = 'green'; 
            } else {
                responseMessageDiv.textContent = data.error; 
                responseMessageDiv.style.color = 'red'; 
            }
        } catch (error) {
            responseMessageDiv.textContent = 'An error occurred. Please try again.'; 
            responseMessageDiv.style.color = 'red'; 
        }
    });
});
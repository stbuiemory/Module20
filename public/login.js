// Function to handle the login form submission
const loginFormHandler = async (event) => {
    event.preventDefault(); 

    // Get the values entered by the user for username and password
    const username = document.querySelector('#username-login').value.trim();
    const password = document.querySelector('#password-login').value.trim();

    // Check if both username and password are entered
    if (!username || !password) {
        alert('Please enter username and password.'); 
    }

    // Proceed with login if both username and password are provided
    if (username && password) {
        try {
            const response = await fetch('/api/users/login', {
                method: 'POST',
                body: JSON.stringify({
                    username,
                    password
                }),
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.ok) {
                document.location.replace('/dashboard');
            }
            else if (response.status === 400) {
                alert('Error with username or password. Please try again.');
            }
            else if (response.status >= 500) {
                alert('Server error: Unable to sign in.');
            }
        } catch (err) {
            console.error(err); 
            alert('Error signing in. Please try again.'); 
        }
    }
};

// Attach the loginFormHandler function to the login form submit button
document.querySelector('#log-in-submit').addEventListener('click', loginFormHandler);
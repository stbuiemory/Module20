// Function to handle user logout
const logout = async() => {
    const response = await fetch('/api/users/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    });
 
    if (response.ok) {
        document.location.replace('/');
        console.log('logged out!'); 
    }
    else {
        alert(response.statusText); 
    }
}

// Attach the logout function to the logout button
document.querySelector('#log-out').addEventListener('click', logout);

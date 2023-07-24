const loginFormHandler = async (event) => {
    event.preventDefault();

    const username = document.querySelector('#username-login').value.trim();
    const password = document.querySelector('#password-login').value.trim();

    if(!username || !password) {
        alert('Please enter username and password.')
    }

    if (username && password) {
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
        } if (response.status === 400) {
            alert('Error with username or password. Please try again.');
        }
        else if (response.status >= 500) {
            alert('Server error: Unable to sign in.')
        }
    }
};

document.querySelector('#log-in-submit').addEventListener('click', loginFormHandler);
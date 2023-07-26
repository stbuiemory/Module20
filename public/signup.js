// Function to handle errors and show appropriate alert messages
const handleErrors = (response) => {
    switch (response.status) {
        case 409:
            alert('Username is already in use.');
            break;
        case 411:
            alert('Your username must be at least 4 characters long.');
            break;
        case 410:
            alert('Your password must be at least 8 characters long.');
            break;
        default:
            alert('An error occurred. Please try again.');
    }
};

// Function to handle sign up form submission
const signupFormHandler = async (event) => {
    event.preventDefault();

    const username = document.querySelector('#username-signup').value.trim();
    const password = document.querySelector('#password-signup').value.trim();

    if (!username || !password) {
        alert('You must provide a username and password before signing up!');
        return;
    }

    try {
        const response = await fetch('/api/users', {
            method: 'POST',
            body: JSON.stringify({
                username,
                password,
            }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            console.log('Success!');
            document.location.replace('/dashboard');
        } else {
            handleErrors(response);
        }
    } catch (error) {
        console.error(error);
        alert('An error occurred. Please try again.');
    }
};

document.querySelector('#sign-up-submit').addEventListener('click', signupFormHandler);
// sign up event handler
const signupFormHandler = async(event) => {
    event.preventDefault();

    const username = document.querySelector('#username-signup').value.trim();
    const password = document.querySelector('#password-signup').value.trim();

    if (!username || !password) {
        alert('You must provide a username and password before signing up!')
    }

    if (username && password){
        const response = await fetch('/api/users', {
            method: 'POST',
            body: JSON.stringify({
                username,
                password
            }),
            headers: { 'Content-Type': 'application/json'}
        });
        if (response.ok) {
            console.log('Success!')
            document.location.replace('/dashboard');
        } 
        if (response.status === 409) {
            alert('Username is already in use.');
        }
        if (response.status === 411) {
            alert('Your username must be at least 4 characters long.')
        }
        if (response.status === 410) {
            alert('Your password must be at least 8 characters long.')
        }
    }
}

document.querySelector('#sign-up-submit').addEventListener('click', signupFormHandler);
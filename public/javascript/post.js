// Function to handle creating a new post
const createPostHandler = async (event) => {
    event.preventDefault();

    // Get the new post's title and body input values
    const title = document.querySelector('#new-post-title').value.trim();
    const post_body = document.querySelector('#new-post-body').value.trim();

    // Validate the title and body inputs
    if (!title || !post_body) {
        alert('Posts require a title and body.');
        return;
    }

    // Send the new post data to the server via a POST request
    try {
        const response = await fetch(`/api/posts`, {
            method: 'POST',
            body: JSON.stringify({ title, post_body }),
            headers: { 'Content-Type': 'application/json' },
        });
        if (response.ok) {
            // Reload the dashboard after successful post creation
            document.location.reload('/dashboard');
        } else {
            alert('Error creating post :(');
        }
    } catch (err) {
        console.error(err);
        alert('Error creating post :(');
    }
};

// Attach the createPostHandler function to the new post button
const newPostButton = document.querySelector('#new-post-save');
newPostButton.addEventListener('click', createPostHandler);

// Function to handle editing a post
const editPostHandler = async (event) => {
    event.preventDefault();
    console.log(event.target);

    // Get the post ID and edited title and body input values
    const postID = event.target.getAttribute('data-id');
    const title = document.querySelector(`#title${postID}`).value;
    const post_body = document.querySelector(`#editedPost${postID}`).value;
    console.log(title);
    console.log(post_body);

    // Send the edited post data to the server via a PUT request
    try {
        const response = await fetch(`/api/posts/${postID}`, {
            method: 'PUT',
            body: JSON.stringify({ title, post_body }),
            headers: { 'Content-Type': 'application/json' },
        });
        if (response.ok) {
            // Reload the dashboard after successful post update
            document.location.reload('/dashboard');
        } else {
            alert(response.statusText);
        }
    } catch (err) {
        console.error(err);
        alert('Error editing this post. Please try again!');
    }
};

// Attach the editPostHandler function to all edit post buttons
const updateButtons = document.querySelectorAll('#edit-post-save');
[...updateButtons].forEach(updateButton => updateButton.addEventListener('click', editPostHandler));

// Function to handle deleting a post
const deletePostHandler = async (event) => {
    event.preventDefault();
    console.log(event.target);

    // Get the post ID
    const postID = event.target.getAttribute('data-id');
    console.log(postID);

    // Send the post ID to the server via a DELETE request
    try {
        const response = await fetch(`api/posts/${postID}`, {
            method: 'DELETE',
            body: JSON.stringify({ id: postID }),
            headers: { 'Content-Type': 'application/json' },
        });
        if (response.ok) {
            // Reload the dashboard after successful post deletion
            document.location.reload('/dashboard');
        } else {
            alert(response.statusText);
        }
    } catch (err) {
        console.error(err);
        alert('Error deleting this post. Please try again!');
    }
};

// Attach the deletePostHandler function to all delete post buttons
const deleteButtons = document.querySelectorAll('#delete-post');
[...deleteButtons].forEach(deleteBtn => deleteBtn.addEventListener('click', deletePostHandler));
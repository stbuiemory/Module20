// Function to handle posting a new comment
const commentEventHandler = async (event) => {
    event.preventDefault();

    // Get the comment input value
    const comment = document.querySelector('#new-comment-body').value.trim();

    // Extract the post ID from the current URL
    const urlSplit = window.location.toString().split('/');
    const postID = urlSplit[urlSplit.length - 1];

    // Validate the comment input
    if (!comment) {
        alert('Error: Empty comment. Please try again.');
        return;
    }
    if (comment.length < 5) {
        alert('Comments must be 5 characters long.');
        return;
    }

    // Send the new comment data to the server via a POST request
    try {
        const response = await fetch('/api/comments', {
            method: 'POST',
            body: JSON.stringify({ comment_body: comment, post_id: postID }),
            headers: { 'Content-Type': 'application/json' },
        });
        if (response.ok) {
            // Reload the page after successful comment submission
            document.location.reload(`/post/${postID}`);
            console.log('Comment posted!');
        } else {
            alert('Error posting comment. Please try again.');
        }
    } catch (err) {
        console.error(err);
        alert('Error posting comment. Please try again.');
    }
};

// Attach the commentEventHandler function to the new comment button
const newCommentButton = document.querySelector('#new-comment-save');
newCommentButton.addEventListener('click', commentEventHandler);

// Function to handle editing a comment
const editCommentHandler = async (event) => {
    event.preventDefault();
    console.log(event.target);

    // Get the comment ID and edited comment input value
    const commentID = event.target.getAttribute('data-id');
    const editedComment = document.querySelector(`#edited-comment${commentID}`).value.trim();
    console.log(commentID, editedComment);

    // Send the edited comment data to the server via a PUT request
    try {
        const response = await fetch(`/api/comments/${commentID}`, {
            method: 'PUT',
            body: JSON.stringify({ id: commentID, comment_body: editedComment }),
            headers: { 'Content-Type': 'application/json' },
        });
        if (response.ok) {
            // Reload the page after successful comment update
            document.location.reload('/');
        } else {
            alert('Error editing this comment. Please try again.');
        }
    } catch (err) {
        console.error(err);
        alert('Error editing this comment. Please try again.');
    }
};

// Attach the editCommentHandler function to all edit comment buttons
const editButtons = document.querySelectorAll('#edit-comment-save');
[...editButtons].forEach(editButton => editButton.addEventListener('click', editCommentHandler));

// Function to handle deleting a comment
const deleteCommentHandler = async (event) => {
    event.preventDefault();
    console.log(event.target);

    // Get the comment ID
    const commentID = event.target.getAttribute('data-id');
    console.log(commentID);

    // Send the comment ID to the server via a DELETE request
    try {
        const response = await fetch(`/api/comments/${commentID}`, {
            method: 'DELETE',
            body: JSON.stringify({ id: commentID }),
            headers: { 'Content-Type': 'application/json' },
        });
        if (response.ok) {
            // Reload the page after successful comment deletion
            document.location.reload('/');
        } else {
            alert('Error deleting this comment. Please try again.');
        }
    } catch (err) {
        console.error(err);
        alert('Error deleting this comment. Please try again.');
    }
};

// Attach the deleteCommentHandler function to all delete comment buttons
const deleteButtons = document.querySelectorAll('#delete-comment');
[...deleteButtons].forEach(deleteButton => deleteButton.addEventListener('click', deleteCommentHandler));
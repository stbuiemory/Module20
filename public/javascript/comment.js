// add comment event handler
const commentEventHandler = async (event) => {
    event.preventDefault();

    const comment = document.querySelector('#new-comment-body').value.trim();

    console.log(window.location.toString().split('/'));

    const urlSplit = window.location.toString().split('/');
    const postID = urlSplit[urlSplit.length - 1];
    console.log(postID)

    if(!comment) {
        alert('Cannot send an empty comment!')
    }
    if (comment.length < 5) {
        alert('Comment needs to be at least 5 characters long!')
    }

    if(comment) {
        const response = await fetch('/api/comments', {
            method: 'POST',
            body: JSON.stringify({ comment_body: comment, post_id: postID }),
            headers: { 'Content-Type': 'application/json' }
        })
        if (response.ok) {
            document.location.reload(`/post/${postID}`)
            console.log('Comment posted!')
        }
        if (response >= 400) {
            alert('Error posting comment. Please try again!')
        }
    }
};

const newCommentButton = document.querySelector('#new-comment-save');
newCommentButton.addEventListener('click', commentEventHandler);

// edit comment handler 
const editCommentHandler = async (event) => {
    event.preventDefault();
    console.log(event.target);

    const commentID = event.target.getAttribute('data-id');
    const editedComment = document.querySelector(`#edited-comment${commentID}`).value.trim();
    console.log(commentID, editedComment)

    const response = await fetch(`/api/comments/${commentID}`, {
        method: 'PUT',
        body: JSON.stringify({ id: commentID, comment_body: editedComment}),
        headers: { 'Content-Type': 'application/json' }
    })
    if(response.ok) {
        document.location.reload('/')
    }
    if (response >= 400) {
        alert('Error editing this comment. Please try again!')
    }
};

const editButtons = document.querySelectorAll('#edit-comment-save');
[...editButtons].forEach(editButton => editButton.addEventListener('click', editCommentHandler));

// delete comment handler
const deleteCommentHandler = async (event) => {
    event.preventDefault();
    console.log(event.target);

    const commentID = event.target.getAttribute('data-id');
    console.log(commentID);

    const response = await fetch(`/api/comments/${commentID}`, {
        method: 'DELETE',
        body: JSON.stringify({ id: commentID }),
        headers: { 'Content-Type': 'application/json' }
    })
    if (response.ok) {document.location.reload('/')
    }
    if (response >= 400) {
        alert('Error deleting this comment. Please try again!')
    }
};

const deleteButtons = document.querySelectorAll('#delete-comment');
[...deleteButtons].forEach(deleteButton => deleteButton.addEventListener('click', deleteCommentHandler));

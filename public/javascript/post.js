// create post event handler
const createPostHandler = async (event) => {
    event.preventDefault();

    const title = document.querySelector('#new-post-title').value.trim();
    const post_body = document.querySelector('#new-post-body').value.trim();

    if(!title || !post_body){
        alert('You cannot create a post without a body or title')
    }

    console.log(title, post_body)

    if (title && post_body){
        const response = await fetch(`/api/posts`, {
            method: 'POST',
            body: JSON.stringify({
                title,
                post_body
            }),
            headers: { 'Content-Type': 'application/json' }
        })    
        if (response.ok) {
            document.location.reload('/dashboard');
        } 
        if (response.statusText === 'Bad Request'){
            alert('Error creating post :(')
        }
    }
};

const newPostButton = document.querySelector('#new-post-save').addEventListener('click', createPostHandler);

// edit post event handler
const editPostHandler = async (event) => {
    event.preventDefault();
    console.log(event.target);

    const postID = event.target.getAttribute('data-id')
    const title = document.querySelector(`#title${postID}`).value
    const post_body = document.querySelector(`#editedPost${postID}`).value
    console.log(title);
    console.log(post_body);

    const response = await fetch(`/api/posts/${postID}`, {
        method: 'PUT',
        body: JSON.stringify({
            title: title,
            post_body: post_body
        }),
        headers: { 'Content-Type': 'application/json' }
    })
    if (response.ok) {
        document.location.reload('/dashboard');
    } 
    if (response.status >=400) {
        alert(response.statusText);
    }
}

const updateButtons = document.querySelectorAll('#edit-post-save');
[...updateButtons].forEach(updateButton => updateButton.addEventListener('click', editPostHandler));

// delete post event handler
const deletePostHandler = async (event) => {
    event.preventDefault();
    console.log(event.target)

    const postID = event.target.getAttribute('data-id')
    console.log(postID)

    const response = await fetch(`api/posts/${postID}`, {
        method: 'DELETE',
        body: JSON.stringify({ id: postID }),
        headers: { 'Content-Type': 'application/json' }
    })
    if (response.ok) {
        document.location.reload('/dashboard')
    }
    if (response.status >=400) {
        alert(response.statusText)
    }
};

const deleteButtons = document.querySelectorAll('#delete-post');
[...deleteButtons].forEach(deleteBtn => deleteBtn.addEventListener('click', deletePostHandler))
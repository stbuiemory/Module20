// Function to open the modal by adding 'is-active' class to the element
function openModal(el) {
    el.classList.add('is-active'); 
};

// Function to close the modal by removing 'is-active' class from the element
function closeModal($el) {
    $el.classList.remove('is-active'); 
};

// Get all elements with class 'js-modal-trigger' and attach event listeners to them
const modalTriggers = document.querySelectorAll('.js-modal-trigger');
modalTriggers.forEach((trigger) => {
    const modal = trigger.dataset.target; 
    const target = document.getElementById(modal); 

    // Add a click event listener to each trigger element
    trigger.addEventListener('click', () => {
        openModal(target); 
    });
});

// Get all elements with class 'delete' and '#cancel' inside '.modal-card-foot' and attach event listeners to them
const modalClosers = document.querySelectorAll('.delete, .modal-card-foot #cancel');
modalClosers.forEach((close) => {
    const target = close.closest('.modal'); 

    // Add a click event listener to each close element
    close.addEventListener('click', () => {
        closeModal(target); 
    });
});
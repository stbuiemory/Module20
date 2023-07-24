function openModal(el) {
    el.classList.add('is-active');
    };

function closeModal($el) {
    $el.classList.remove('is-active');
    };


const modalTriggers = document.querySelectorAll('.js-modal-trigger')
modalTriggers.forEach((trigger) => {
    const modal = trigger.dataset.target;
    const target = document.getElementById(modal);

    trigger.addEventListener('click', () => {
        openModal(target);
    });
});


const modalClosers = (document.querySelectorAll('.delete, .modal-card-foot #cancel'))
modalClosers.forEach((close) => {
    const target = close.closest('.modal');

    close.addEventListener('click', () => {
        closeModal(target);
    });
});
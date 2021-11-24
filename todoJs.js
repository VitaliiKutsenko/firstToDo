let modal = document.getElementById('modalWindow');
let modButton = document.getElementById('todoCreate');
let listArea = document.getElementsByTagName('list-area');

let headerss = document.querySelectorAll('.prior');
let priors = document.querySelectorAll('.priority-item');

let headerModal = document.querySelectorAll('.modal');
let modalItem = document.querySelectorAll('.modal-item');

let headerStatus = document.querySelectorAll('.status');
let statusItem = document.querySelectorAll('.status-item');

let selectAll = function (headers, prior, select, selectLabel) {
    headers.forEach((item) => {
        item.addEventListener('click', selectToggle);
    });

    prior.forEach((item) => {
        item.addEventListener('click', priorChoose);
    });

    function selectToggle() {
        this.parentElement.classList.toggle('is-active');
    }

    window.addEventListener('click', function (event) {
        if (event.target.outerText !== selectLabel.innerText) {
            select.classList.remove('is-active');
        }
    });

    function priorChoose() {
        let text = this.innerText;
        selectLabel.innerText = text;
        select.classList.remove('is-active');
        console.log(text);
    }
};
let modalHeader = document.querySelector('.modal-header');
let priorityHeader = document.querySelector('.priority-header');
let statusHeader = document.querySelector('.status-header');
let modalCurr = document.querySelector('.modal-current');
let priorityCurrent = document.querySelector('.priority-current');
let statusCurrent = document.querySelector('.status-current');

selectAll(headerModal, modalItem, modalHeader, modalCurr);
selectAll(headerStatus, statusItem, statusHeader, statusCurrent);
selectAll(headerss, priors, priorityHeader, priorityCurrent);

function full(filters, filButtons) {
    let fill = filters;
    let butt = filButtons;
    let cancelButton = document.querySelector('#modal-cancel');
    butt.onclick = function () {
        fill.style.display = 'flex';
        cancelButton.addEventListener('click', closeWindow);
        window.addEventListener('click', closeWindow);
        function closeWindow() {
            console.log(event);
            if (event.target == fill || event.target == cancelButton) {
                fill.style.display = 'none';
            }
        }
    };
}

full(modal, modButton);

let addTitle = document.getElementById('add-input');
let addDescription = document.getElementById('modal-description');
let modalSave = document.getElementById('modal-save');
let modalCancel = document.getElementById('modal-cancel');
let modalCurrent = document.querySelector('.modal-current');
let todo = document.querySelector('.todo');

// ______________________________________________________

modalSave.addEventListener('click', function (event) {
    function breakButton() {
        if (addDescription.value.length > 0 && addTitle.value.length > 0) {
            let newTodo = {
                title: addTitle.value,
                description: addDescription.value,
                checked: false,
                modalStatus: modalCurrent.innerText,
                newId: Date.now(),
                statusDo: 'open',
            };
            render.push(newTodo);
            localStorage.setItem('todoKey', JSON.stringify(render));
            displayMenu(render);
        } else {
            let newAlert = document.createElement('div');
            newAlert.innerHTML =
                '<div class="opacityText">"To short...Please, more symbol"</div>';
            let modal = document.getElementById('modalWindow');
            modal.prepend(newAlert);
            setTimeout(() => newAlert.remove(), 1000);
        }
    }
    breakButton();
});

let renderFilter = [];
let render;
function callRender() {
    if (localStorage.getItem('todoKey')) {
        render = JSON.parse(localStorage.getItem('todoKey'));
    } else {
        render = [];
    }
}
callRender();

function displayMenu(ind) {
    let displayMessage = '';
    ind.forEach((item, i) => {
        displayMessage += `

<div class="items" data-remove = "${item.newId}">
<input type="checkbox" name="" class="checkbox" data-done="${item.statusDo}" 
data-checkbox="${item.newId}" checked = "${item.checked}" >
 <div class="task" data-task="${item.newId}">
<div class="todo-list" data-title="${item.newId}">${item.title}</div>
<div class="display-description" data-description="${item.newId}">${item.description}</div>
<div class="tables">
<div class="show-priority">${item.modalStatus}</div>
<ul class="drop">...
<div class="window">
<li class="drop_done" id="${i}" data-done="${item.newId}">done</li>
<li class="drop_edit" data-edit ="${item.newId}">edit</li>
<li class="drop_delete" id="" data-id="${i}"  data-removed="${item.newId}">delete</li>
</div>
</ul>
</div>
</div>
</div>
`;
        todo.innerHTML = displayMessage;
    });
    searchByTitle();
    editor();
    dropMenu();
    filterForDone();
    filters();
    newDone();
    trueCheck();
    checkBox();
    editList();
}
displayMenu(render);

function filterForDone() {
    let checkDone = document.querySelectorAll('[data-checkbox]');
    let doneClick = document.querySelectorAll('.status-item');
    doneClick.forEach((done) =>
        done.addEventListener('click', function (event) {
            let clickEvent = event.currentTarget.outerText.toUpperCase();
            Array.from(checkDone).filter((item) => {
                if (
                    item.dataset.done.toUpperCase() == clickEvent &&
                    clickEvent == `${clickEvent}`
                ) {
                    item.parentElement.style.display = 'block';
                } else if (clickEvent == 'ALL') {
                    item.parentElement.style.display = 'block';
                } else {
                    item.parentElement.style.display = 'none';
                }
            });
        })
    );
}
filterForDone();

function filters() {
    let filterItems = document.querySelectorAll('.items');
    priors.forEach((priority) => {
        priority.addEventListener('click', function (event) {
            let allEvent = event.currentTarget.outerText.toUpperCase();
            Array.from(filterItems).filter((item) => {
                if (
                    item.lastElementChild.lastElementChild.firstElementChild.outerText.toUpperCase() ==
                        event.currentTarget.outerText.toUpperCase() &&
                    event.currentTarget.outerText.toUpperCase() == `${allEvent}`
                ) {
                    item.style.display = 'block';
                } else if (
                    item.lastElementChild.lastElementChild.firstElementChild.outerText.toUpperCase() !=
                        event.currentTarget.outerText.toUpperCase() &&
                    event.currentTarget.outerText.toUpperCase() == 'ALL'
                ) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}
filters();

function dropMenu() {
    let editButton = document.querySelectorAll('.drop');
    editButton.forEach((item) =>
        item.addEventListener('click', function (event) {
            event.currentTarget.firstElementChild.classList.toggle('is-active');
        })
    );
}

function editor() {
    let deleteList = document.querySelectorAll('.drop_delete');
    let itemed = document.querySelectorAll('.task');
    deleteList.forEach((button) =>
        button.addEventListener('click', function (event) {
            let bull = event.currentTarget.dataset.removed;
            let idBull = event.target.dataset.id;
            let removeDom = document.querySelectorAll('[data-remove]');
            console.log(idBull);
            function removeItem() {
                removeDom.forEach((item) => {
                    if (item.dataset.remove === bull) {
                        itemed.forEach((newItem) => {
                            if (newItem.dataset.task === item.dataset.remove) {
                                newItem.insertAdjacentHTML(
                                    'afterbegin',
                                    `<div class="confirmDelete">
        <div class="windowConfirm">Are you sure?</div>
       <div class="forFlex">
        <div class="confirmYes">Yes</div>
        <div class="confirmNo">No</div>
        </div>
    
    </div>`
                                );
                            }
                        });
                    }
                    let confirmYes = document.querySelectorAll('.confirmYes');
                    let confirmNo = document.querySelectorAll('.confirmNo');
                    confirmYes.forEach((thisConfirm) =>
                        thisConfirm.addEventListener('click', function (event) {
                            if (item.dataset.remove === bull) {
                                item.remove(removeDom) ||
                                    render.splice(idBull, 1);
                                console.log(item);
                                console.log(idBull);
                                localStorage.setItem(
                                    'todoKey',
                                    JSON.stringify(render)
                                );
                                displayMenu(render);
                            }
                        })
                    );
                    confirmNo.forEach((thisConfirmNo) =>
                        thisConfirmNo.addEventListener(
                            'click',
                            function (event) {
                                if (event.target === this) {
                                    displayMenu(render);
                                }
                            }
                        )
                    );
                });
            }
            removeItem();
        })
    );
}

function newDone() {
    let doneTodo = document.querySelectorAll('.drop_done');
    doneTodo.forEach((butDone) =>
        butDone.addEventListener('click', function (event) {
            let idDone = event.currentTarget.dataset.done;
            render.forEach((id) => {
                if (id.newId == idDone) {
                    id.checked = true;
                    id.statusDo = 'done';
                    localStorage.setItem('todoKey', JSON.stringify(render));
                }
            });
            displayMenu(render);
        })
    );
}

function trueCheck() {
    const checkDone = document.querySelectorAll('[data-checkbox]');
    render.forEach((rendId) => {
        if (rendId.checked === true) {
            Array.from(checkDone).forEach((item) => {
                if (item.dataset.checkbox == rendId.newId) {
                    item.classList.add('is-active');
                    item.nextElementSibling.style.background =
                        'rgb(209, 200, 200)';
                }
            });
        }
    });
}

function checkBox() {
    const checkDone = document.querySelectorAll('[data-checkbox]');
    checkDone.forEach((checkActive) =>
        checkActive.addEventListener('click', function (event) {
            if (checkActive.checked == event.target.checked);
            {
                checkActive.classList.remove('is-active');
                checkActive.nextElementSibling.style.background = 'white';
                render.forEach((item) => {
                    if (item.newId == checkActive.dataset.checkbox) {
                        item.checked = false;
                        item.statusDo = 'open';
                        localStorage.setItem('todoKey', JSON.stringify(render));
                    }
                });
            }
        })
    );
}
function editList() {
    let editClick = document.querySelectorAll('.drop_edit');

    editClick.forEach((editor) =>
        editor.addEventListener('click', function (event) {
            let newEvent = event.currentTarget.dataset.edit;
            render.forEach((item) => {
                if (item.newId === parseInt(newEvent)) {
                    document.body.insertAdjacentHTML(
                        'afterbegin',
                        `
<div class="opacity-windows">
    <div class="edit_items" data-remove = "${item.newId}">
            <div class="edit_task" data-task="${item.newId}">
            <label for="titles">Title</label>
                <input class="edit_todo-list"autocomplete="off" value="${item.title}" name="titles" placeholder="">
            <label for="descriptions">Description</label>
                <input class="edit_display-description" autocomplete="off"  value="${item.description}" type="text" name="descriptions" placeholder="">
                       <div class="tables">
                           <div class="edit_show-priority">${item.modalStatus}</div>
                                <div class="edit_window">
                                    <li class="edit_drop_menu" data-done="${item.newId}">Hight</li>
                                    <li class="edit_drop_menu" data-edit ="${item.newId}">Normal</li>
                                    <li class="edit_drop_menu" data-removed="${item.newId}">Low</li>
                                </div>
                            
                        <div class="edit_drop">save</div>
            </div>
        </div>
    </div>
</div>
`
                    );

                    closeWindow(item, newEvent);
                    editPriority();
                }
            });
        })
    );
    function editPriority() {
        let editButtons = document.querySelectorAll('.edit_show-priority');
        let editMenu = document.querySelectorAll('.edit_drop_menu');
        editButtons.forEach((item) =>
            item.addEventListener('click', function (event) {
                event.currentTarget.nextElementSibling.classList.toggle(
                    'is-active'
                );
                editMenu.forEach((items) =>
                    items.addEventListener('click', function (events) {
                        let newText = events.currentTarget.innerText;
                        item.innerText = newText;
                        item.nextElementSibling.classList.remove('is-active');
                    })
                );
            })
        );
    }

    function closeWindow(add, events) {
        let saveChange = document.querySelectorAll('.edit_drop');
        let deleteWindow = document.querySelector('.opacity-windows');
        let titleChanges = document.querySelector('.edit_todo-list');
        let descriptionChanges = document.querySelector(
            '.edit_display-description'
        );
        let priorityChanges = document.querySelector('.edit_show-priority');
        deleteWindow.addEventListener('click', function (event) {
            if (event.target === this) {
                deleteWindow.remove();
            }
        });
        saveChange.forEach((item) =>
            item.addEventListener('click', function (event) {
                if (event.currentTarget == this) {
                    deleteWindow.remove();
                }

                function saveChanges() {
                    render.forEach((newRender) => {
                        if (newRender.newId === parseInt(events)) {
                            add.title = titleChanges.value;
                            add.description = descriptionChanges.value;
                            add.modalStatus = priorityChanges.innerText;
                            localStorage.setItem(
                                'todoKey',
                                JSON.stringify(render)
                            );
                            displayMenu(render);
                        }
                    });
                }
                saveChanges();
            })
        );
    }
}
function searchByTitle() {
    let inputSearch = document.querySelector('#todoSearch');
    let todoList = document.querySelectorAll('.todo-list');
    inputSearch.addEventListener('input', function (event) {
        let newEvent = event.target.value.toUpperCase().trim();
        if (inputSearch !== ' ') {
            todoList.forEach((list) => {
                if (list.innerText.toUpperCase().search(newEvent) > -1) {
                    list.parentElement.style.display = 'flex';
                } else {
                    list.parentElement.style.display = 'none';
                }
            });
        }
    });
}

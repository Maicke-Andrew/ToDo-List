const btnAdd = document.querySelector('#createTask');
const inputTask = document.querySelector('#texto-tarefa');
const olList = document.querySelector('#lista-tarefas');
const btnDell = document.querySelector('#deleteAll');
const btnDellCompleteTasks = document.querySelector('#deleteTasksCompleted');
const btnSaveLocal = document.querySelector('#saveLocalStorage');
const btnDownElement = document.querySelector('#downElement');
const btnUpElement = document.querySelector('#upElement');
const btnDellSelected = document.querySelector('#deleteSelected');
const allEvent = [btnDellSelected, btnUpElement, btnDownElement, btnAdd, btnDell, btnDellCompleteTasks, btnSaveLocal];
let liList = document.querySelectorAll('li');
let selected = document.querySelector('.selected');
let eventOnElement = ['click', 'dblclick'];
let callFunction;
let completed;

const allFunc = {
    createTask: (item) => {
        // console.log(!inputTask.value, item.task)
        if (!inputTask.value && !item.task) { } else {
            let li = document.createElement('li');
            if (!inputTask.value) {
                li.innerHTML = item.task;
                (item.class) && li.classList.add(item.class)
            } else {
                li.innerHTML = inputTask.value;
            }

            olList.appendChild(li);
            inputTask.value = '';
            liList = document.querySelectorAll('li');
            eventOnElement.forEach(item => {
                (item === 'click') ?
                    liList.forEach(elementClick => {
                        elementClick.addEventListener(item, allFunc.changeColor);
                    })
                    :
                    liList.forEach(elementDouble => {
                        elementDouble.addEventListener(item, allFunc.completedTask);
                    })
            })
        }
    },
    changeColor: (e) => {
        liList = document.querySelectorAll('li');
        liList.forEach(item => {
            item.classList.remove('selected');
            e.target.classList.add('selected');
        })
    },
    completedTask: (e) => {
        if (e.target.classList.contains('completed')) {
            e.target.classList.remove('completed');
            e.target.classList.add('incomplete');
        } else {
            e.target.classList.remove('incomplete');
            e.target.classList.add('completed');
        }
    },
    deleteAll: () => {
        while (olList.firstChild) {
            olList.removeChild(olList.firstChild);
        }
    },
    deleteTasksCompleted: () => {
        liList = document.querySelectorAll('li');
        liList.forEach(item => (item.classList.contains('completed') && item.remove()))
    },
    saveLocalStorage: () => {
        liList = document.querySelectorAll('li');
        localStorage.clear();
        liList.forEach(item => {
            let listSaved = JSON.parse(localStorage.getItem('li', '[{}]'));

            (item.classList.contains('completed')) ? completed = 'completed' : completed = '';

            if (!listSaved) {
                localStorage.setItem('li', JSON.stringify([{
                    task: item.innerHTML,
                    class: completed
                }]));
            }
            else if (item.innerHTML) {
                listSaved.push({
                    task: item.innerHTML,
                    class: completed
                });
                localStorage.setItem('li', JSON.stringify(listSaved));
            }
        })
    },
    downElement: () => {
        selected = document.querySelector('.selected');
        if (selected) {
            if (selected.nextSibling !== null) {
                let siblingNext = selected.nextSibling;
                selected.nextSibling.remove();
                selected.parentNode.insertBefore(siblingNext, selected);
            }
        }
    },
    upElement: () => {
        selected = document.querySelector('.selected');
        if (selected) {
            if (selected.previousSibling !== null) {
                let siblingPrev = selected.previousSibling;
                selected.previousSibling.remove();
                selected.parentNode.insertBefore(siblingPrev, selected.nextSibling);
            }
        }
    },
    deleteSelected: () => {
        selected = document.querySelector('.selected');
        selected.remove();
    },
    savedList: () => {
        if (!olList.firstChild) {
            let listLocal = JSON.parse(localStorage.getItem('li', '{}'));
            if (listLocal) {
                listLocal.forEach(item => {
                    allFunc.createTask(item);
                })
            }
        }
    }
}

allEvent.forEach(item => {
    item.addEventListener('click', allFunc[item.id])
})

olList.addEventListener('load', allFunc.savedList);
allFunc.savedList();
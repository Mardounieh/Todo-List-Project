const addItemButton = document.querySelector('.addItemButton');
const categoryContainer = document.querySelector('.categoryContainer');
const categoryicon = document.querySelectorAll('.categoryContainer i');
const form = document.getElementsByTagName("form"); 
const input = document.querySelector('input');
const todoContainer = document.querySelector('.todoContainer ul');
document.addEventListener('DOMContentLoaded',getTodo);
addItemButton.addEventListener('click', (e) => {
    categoryContainer.classList.toggle('pos');
    categoryContainer.classList.toggle('absolute');
    categoryContainer.parentNode.classList.toggle('visible');
})
categoryicon.forEach(icon => {
    icon.addEventListener('click', () => {
        categoryContainer.classList.remove('pos')
        categoryContainer.classList.add('absolute')
        categoryContainer.parentElement.classList.remove('visible')
        const iconClass = [`${icon.classList[1]}`, `${icon.classList[2]}`]
        addItem(input.value,iconClass);
        input.value = '';
    })
})

function addItem(text,icon,isSave = true) {
    const todoItem = document.createElement('div');
    todoItem.setAttribute('draggable', true);
    const empty = document.createElement('h3');
    todoItem.classList.add('todoItem');
    if(text == '') {
        empty.innerText = 'First, Write something, Idiot!';
        todoContainer.appendChild(empty);
    }
    else {
        todoItem.innerHTML = `
            <li>${text}</li>
            <i class="fad fa-shield-check"></i>
            <i class="fad fa-file-edit"></i>
            <i class="fad fa-trash"></i>
        `
        const catIcon = document.createElement('i');
        catIcon.classList.add('fad');
        catIcon.classList.add(icon[0]);
        catIcon.classList.add(icon[1]);

        todoContainer.appendChild(todoItem)
        todoItem.insertBefore(catIcon,todoItem.childNodes[1]);
        const bgColor = getComputedStyle(catIcon).getPropertyValue('background-color');
        todoItem.style.background = bgColor;
        if(isSave) saveTodo(text,icon);
    }

    //! Drag And Drop

    todoItem.addEventListener('dragstart', () => {
        todoItem.classList.add('dragging');
    })
    todoItem.addEventListener('dragend', () => {
        todoItem.classList.remove('dragging');
    })

    todoContainer.addEventListener('dragover', (e) => {
        e.preventDefault();
        const aftterElement = getDragAfterElement(todoContainer, e.clientY);
        const dragging = document.querySelector('.dragging');
        if(aftterElement == null) {
            todoContainer.appendChild(dragging);
        } else {
            todoContainer.insertBefore(dragging, aftterElement);
        }
    })

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.todoItem:not(.dragging)')];
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if(offset < 0 && offset > closest.offset) {
                return {offset: offset, element: child}
            } else {
                return closest;
            }
        }, {offset: Number.NEGATIVE_INFINITY}).element
    }

    //! Drag And Drop
}

todoContainer.addEventListener('click',optionTodo);
function optionTodo(event){
    const targetIcon = event.target.classList[1];
    const targetParent = event.target.parentNode;
    if(targetIcon === 'fa-shield-check') {
        targetParent.classList.toggle('completed');

    }
    else if(targetIcon === 'fa-trash') {
        targetParent.remove();
    }
    else if(targetIcon === 'fa-file-edit') {
        targetParent.childNodes[2].toggleAttribute('contenteditable');
        targetParent.classList.toggle('editing')
    }
}

function saveTodo(text,icon) {
    const todoList = localStorage.getItem('todo') ? JSON.parse(localStorage.getItem("todo")) : [];
    const todoItemLocal = {
        text,
        icon
    }
    todoList.push(todoItemLocal);
    localStorage.setItem('todo',JSON.stringify(todoList));
}
function getTodo() {
    const todoList = localStorage.getItem('todo') ? JSON.parse(localStorage.getItem("todo")) : [];
    todoList.forEach(todo => {
        addItem(todo.text,todo.icon,false);
    })
}
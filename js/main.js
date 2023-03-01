/* константи, що зберігають елементи сторінки:
   1) поле вводу нового пункту справ
   2) кнопка для додавання нового пункту справ
   3) відповідно сам список справ                 */
const addMessage = document.querySelector('.message'),
      addButton = document.querySelector('.add'),
      todo = document.querySelector('.todo');

/* константа натиснення на Enter */
const ENTER_CONST = 13;

// масив - список справ
let todoList = [];

/* якщо у локальному сховищі вже збережено деякий список,
   він записується у масив */
if (localStorage.getItem('todo')) {
    todoList = JSON.parse(localStorage.getItem('todo'));
}

// відображення задач та процесу виконання
displayMessages();
displayProgress();

// додавання нового пункту до листа при натисненні на Enter
addMessage.addEventListener('keydown', addToList);

// додавання новго пункта до листа при натисненні на кнопку
addButton.addEventListener('click', addToList)

// видалення пункту з листа
todo.addEventListener('click', deleteFromList)

// зміна даних списку у разі зміни статусу задачі в списку
todo.addEventListener('change', todoStatusChange);

// реалізація механізму виділення "важливих" задач по натисненню ПКМ
todo.addEventListener('contextmenu', setImportant)

// функції, що реалізують функціонал списку задач
function displayMessages() {
    let displayableMessage;

    if (todoList.length === 0) displayableMessage = 'List is empty!';

    else {
        displayableMessage = '';
        todoList.forEach(function (item, i) {
            // перевірка виконаності задачі
            const isDone = item.checked;

            // записуємо розмітку елемента у відповідності до того, чи є "важливою" чи виконаною задача
            displayableMessage += `
            <li id="todo_item">
                <input type='checkbox' id='item_${i}' ${isDone ? 'checked' : ''}>
                <label for='item_${i}' id='todo-label' 
                                       class='${isDone ? 'task-title--done' : 
                                                item.important ? 'important' : ''}'>${item.todo}</label>
                <button type="button" id='delete-button' data-action="delete">
                    <img src="./img/delete.png" alt="Delete" width="10" height="10">
                </button>
            </li>
        `;
        })
    }

    // відображаємо список
    todo.innerHTML = displayableMessage;
}

function addToList(event) {
    let addValue = addMessage.value;
    // якщо поле пусте, то воно не додається
    if (!addValue || event.type === "keydown" && event.keyCode !== ENTER_CONST) return;

    let newTodo = {
        todo: addValue, checked: false, important: false
    }
    todoList.push(newTodo);

    // оновлюємо та візуалізуємо дані
    updateData();

    // очищення поля вводу та фокус на ньому
    addMessage.value = ``;
    addMessage.focus();
}

function deleteFromList(event) {
    // якщо натиснена кнопка дії видалення
    if (event.target.dataset.action === 'delete') {

        // знаходимо справу, до якої стосувалося видалення
        const todoElement = event.target.closest('#todo_item');
        const todoLabel = todoElement.querySelector('label');
        let labelValue = todoLabel.innerHTML;

        todoList.forEach(function (item, i) {
            //видаляємо відповідну справу з масиву
            if (item.todo === labelValue) {
                todoList.splice(i, 1)
            }
        });

        updateData();
    }
}

// функція використовується для встановлення "важливої" справи по натисканню ПКМ по ній
function setImportant(event) {
    // відміна дії ПКМ за замовчуванням
    event.preventDefault();

    todoList.forEach(function (item) {
        if (item.todo === event.target.innerHTML) {
            item.important = !item.important;

            updateData();
        }
    })
}

// функція використовується для зміни статусу справи на виконану або навпаки
function todoStatusChange(event) {
    // знаходимо справу, статус якої було змінено
    const inputId = event.target.getAttribute('id');
    const forLabel = todo.querySelector('[for=' + inputId + ']');
    let labelValue = forLabel.innerHTML;

    todoList.forEach(function (item) {
        if (item.todo === labelValue) {
            item.checked = !item.checked;

            updateData();
        }
    })
}

/* функція повертає відображає у відповідному блоку відсоток кількості
   виконаних задач*/
function displayProgress() {
    let progressBar = document.querySelector('.progress_bar');

    progressBar.hidden = (todoList.length === 0);

    const progress = executionProgress();

    progressBar.innerHTML = 'Progress: ' +
        ((todoList.length === 0) ? 'no tasks to do.' : `${progress}%`);

    progressBar.style.textDecoration = (progress === 100) ? 'underline' : 'none';
}

// функція визначає кількість та повертає відсоток виконаних задач
function executionProgress() {
    let count = 0;
    for (let item of todoList) {
        if (item.checked)  count++;
    }
    return Math.round(count/todoList.length * 100);
}

// функція оновлює дані у локальному сховищі та відображує оновлений список та прогрес виконання
function updateData() {
    displayMessages();
    displayProgress();
    localStorage.setItem('todo', JSON.stringify(todoList));
}

// функція виводить повідомлення з основним функціоналом додатку
function getHelp() {
    alert('This is a to-do list app.' +
        '\n\nToday\'s functionality:' +
        '\n- You can create your own to-do list by adding its tasks; to add new task write down a description of' +
        ' the task and click button "Add new item". Be careful: a task with empty description is not allowed!' +
        '\n- Click on the task or a tagpoint on left to him to mark it as completed.' +
        '\n- Click on the cross button on right to the task to delete it from the list.' +
        '\n- You can get a visual information about the overall progress of your list execution;' +
        '\n- You can tag your tasks as important by right-clicking  on task in a list.');
}
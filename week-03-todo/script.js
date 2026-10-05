const taskInput = document.getElementById('taskInput');
const addTaskButton = document.getElementById('addTaskButton');
const taskList = document.getElementById('taskList');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

renderTasks();

console.log(tasks);

addTaskButton.addEventListener('click', () => {
    const taskText = taskInput.value.trim();

    if (taskText !== '') {
        tasks.push({
            text: taskText,
            completed: false
        });

        localStorage.setItem('tasks', JSON.stringify(tasks));

        renderTasks();

        taskInput.value = '';
        taskInput.focus();
    } else {
        alert('Please enter a task.');
    }
});

taskInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        addTaskButton.click();
    }
});

function renderTasks() {
    taskList.innerHTML = '';

    tasks.forEach((task, index) => {
        const listItem = document.createElement('li');
        const deleteButton = document.createElement('button');

        listItem.textContent = task.text;
        deleteButton.textContent = 'Delete';

    listItem.addEventListener('click', () => {
        tasks[index].completed = !tasks[index].completed;

        localStorage.setItem('tasks', JSON.stringify(tasks));

        renderTasks();
    });

    deleteButton.addEventListener('click', (event) => {
        event.stopPropagation();

        tasks.splice(index, 1);

        localStorage.setItem('tasks', JSON.stringify(tasks));

        renderTasks();
    });

        if (task.completed) {
            listItem.classList.add('completed');
        }

        listItem.appendChild(deleteButton);
        taskList.appendChild(listItem);
    });
}
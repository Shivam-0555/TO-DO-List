let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

function addTask() {

    const text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task!");
        return;
    }

    const task = {
        id: Date.now(),
        text: text,
        completed: false
    };

    tasks.push(task);

    saveTasks();
    displayTasks();

    taskInput.value = "";
}

function displayTasks(filteredTasks = tasks) {

    taskList.innerHTML = "";

    filteredTasks.forEach(function(task) {

        const li = document.createElement("li");

        li.className = "task";

        li.innerHTML = `
            <input
                type="checkbox"
                class="check"
                ${task.completed ? "checked" : ""}
                onchange="toggleTask(${task.id})"
            >

            <span class="task-text ${task.completed ? "completed" : ""}">
                ${task.text}
            </span>

            <button class="edit" onclick="editTask(${task.id})">
                Edit
            </button>

            <button class="delete" onclick="deleteTask(${task.id})">
                Delete
            </button>
        `;

        taskList.appendChild(li);
    });

    updateStats();
}

function toggleTask(id) {

    tasks = tasks.map(function(task) {

        if (task.id === id) {
            task.completed = !task.completed;
        }

        return task;
    });

    saveTasks();
    displayTasks();
}

function deleteTask(id) {

    tasks = tasks.filter(function(task) {
        return task.id !== id;
    });

    saveTasks();
    displayTasks();
}

function editTask(id) {

    const task = tasks.find(function(task) {
        return task.id === id;
    });

    const newText = prompt("Edit your task:", task.text);

    if (newText !== null && newText.trim() !== "") {

        task.text = newText.trim();

        saveTasks();
        displayTasks();
    }
}

function searchTasks() {

    const searchText =
        document.getElementById("searchInput").value.toLowerCase();

    const filteredTasks = tasks.filter(function(task) {

        return task.text.toLowerCase().includes(searchText);

    });

    displayTasks(filteredTasks);
}

function updateStats() {

    const total = tasks.length;

    const completed = tasks.filter(function(task) {
        return task.completed;
    }).length;

    const pending = total - completed;

    document.getElementById("total").textContent = total;
    document.getElementById("completed").textContent = completed;
    document.getElementById("pending").textContent = pending;
}

function saveTasks() {

    localStorage.setItem("tasks", JSON.stringify(tasks));
}

displayTasks();
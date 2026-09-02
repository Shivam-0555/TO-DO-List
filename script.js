let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let activeFilter = "all";

const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const taskForm = document.getElementById("taskForm");
const searchInput = document.getElementById("searchInput");
const emptyState = document.getElementById("emptyState");

document.getElementById("currentDate").textContent = new Intl.DateTimeFormat("en-US", {
    weekday: "long", month: "long", day: "numeric"
}).format(new Date());

taskForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addTask();
});

searchInput.addEventListener("input", renderTasks);
document.querySelectorAll(".filter").forEach(function (button) {
    button.addEventListener("click", function () {
        activeFilter = button.dataset.filter;
        document.querySelectorAll(".filter").forEach(function (item) {
            item.classList.toggle("active", item === button);
        });
        document.getElementById("listLabel").textContent = activeFilter.toUpperCase() + " TASKS";
        renderTasks();
    });
});

function addTask() {
    const text = taskInput.value.trim();
    if (!text) return;
    tasks.push({ id: Date.now(), text: text, completed: false });
    saveTasks();
    renderTasks();
    taskInput.value = "";
    taskInput.focus();
}

function renderTasks() {
    const searchText = searchInput.value.trim().toLowerCase();
    const filteredTasks = tasks.filter(function (task) {
        const matchesFilter = activeFilter === "all" || (activeFilter === "completed" ? task.completed : !task.completed);
        return matchesFilter && task.text.toLowerCase().includes(searchText);
    });

    taskList.innerHTML = "";
    filteredTasks.forEach(function (task, index) {
        const item = document.getElementById("taskTemplate").content.firstElementChild.cloneNode(true);
        const checkbox = item.querySelector(".check");
        item.classList.toggle("done", task.completed);
        item.style.animationDelay = `${index * 35}ms`;
        checkbox.checked = task.completed;
        checkbox.addEventListener("change", function () { toggleTask(task.id); });
        item.querySelector(".task-text").textContent = task.text;
        item.querySelector(".edit").addEventListener("click", function () { editTask(task.id); });
        item.querySelector(".delete").addEventListener("click", function () { deleteTask(task.id); });
        taskList.appendChild(item);
    });

    emptyState.hidden = filteredTasks.length !== 0;
    updateStats();
}

function toggleTask(id) {
    tasks = tasks.map(function (task) {
        if (task.id === id) task.completed = !task.completed;
        return task;
    });
    saveTasks();
    renderTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(function (task) { return task.id !== id; });
    saveTasks();
    renderTasks();
}

function editTask(id) {
    const task = tasks.find(function (item) { return item.id === id; });
    const newText = prompt("Edit your task:", task.text);
    if (newText !== null && newText.trim() !== "") {
        task.text = newText.trim();
        saveTasks();
        renderTasks();
    }
}

function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(function (task) { return task.completed; }).length;
    const pending = total - completed;
    const percent = total ? Math.round((completed / total) * 100) : 0;
    document.getElementById("progressLabel").textContent = `${percent}% done`;
    document.getElementById("progressBar").style.width = `${percent}%`;
    document.getElementById("pendingHeader").textContent = pending;
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

renderTasks();
const taskInput = document.getElementById("taskInput");
const addTaskButton = document.getElementById("addTask");
const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");
const taskCount = document.getElementById("taskCount");
const filterButtons = document.querySelectorAll(".filter");

let tasks = JSON.parse(localStorage.getItem("rajaTasks")) || [];
let currentFilter = "all";

function saveTasks() {
    localStorage.setItem("rajaTasks", JSON.stringify(tasks));
}

function createTask() {
    const text = taskInput.value.trim();

    if (!text) {
        alert("Please enter a task.");
        return;
    }

    tasks.push({
        id: Date.now(),
        text,
        completed: false
    });

    taskInput.value = "";

    saveTasks();
    renderTasks();
}

function toggleTask(id) {
    tasks = tasks.map(task =>
        task.id === id
            ? { ...task, completed: !task.completed }
            : task
    );

    saveTasks();
    renderTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);

    saveTasks();
    renderTasks();
}

function editTask(id) {
    const task = tasks.find(task => task.id === id);

    if (!task) return;

    const updatedText = prompt("Edit your task:", task.text);

    if (updatedText === null) return;

    const cleanText = updatedText.trim();

    if (!cleanText) {
        alert("Task cannot be empty.");
        return;
    }

    task.text = cleanText;

    saveTasks();
    renderTasks();
}

function getFilteredTasks() {
    if (currentFilter === "pending") {
        return tasks.filter(task => !task.completed);
    }

    if (currentFilter === "completed") {
        return tasks.filter(task => task.completed);
    }

    return tasks;
}

function renderTasks() {
    const filteredTasks = getFilteredTasks();

    taskList.innerHTML = "";

    filteredTasks.forEach(task => {
        const taskElement = document.createElement("div");

        taskElement.className = `task ${
            task.completed ? "completed" : ""
        }`;

        taskElement.innerHTML = `
            <button class="check" title="Complete task"></button>

            <div class="task-text">${escapeHTML(task.text)}</div>

            <div class="task-actions">
                <button class="edit" title="Edit">✎</button>
                <button class="delete" title="Delete">×</button>
            </div>
        `;

        taskElement
            .querySelector(".check")
            .addEventListener("click", () => toggleTask(task.id));

        taskElement
            .querySelector(".edit")
            .addEventListener("click", () => editTask(task.id));

        taskElement
            .querySelector(".delete")
            .addEventListener("click", () => deleteTask(task.id));

        taskList.appendChild(taskElement);
    });

    emptyState.style.display =
        filteredTasks.length === 0 ? "block" : "none";

    const pending = tasks.filter(task => !task.completed).length;

    taskCount.textContent =
        `${pending} ${pending === 1 ? "task" : "tasks"} pending`;
}

function escapeHTML(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        filterButtons.forEach(btn => btn.classList.remove("active"));

        button.classList.add("active");

        currentFilter = button.dataset.filter;

        renderTasks();
    });
});

addTaskButton.addEventListener("click", createTask);

taskInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        createTask();
    }
});

renderTasks();
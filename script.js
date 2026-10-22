
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");
const emptyMessage = document.getElementById("emptyMessage");
const submitButton = document.getElementById("submitButton");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const remainingTasks = document.getElementById("remainingTasks");
const clearCompleted = document.getElementById("clearCompleted");

let tasks = [];

try {
    const savedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (Array.isArray(savedTasks)) {
        tasks = savedTasks.filter(
            task =>
                task &&
                typeof task.id === "string" &&
                typeof task.text === "string" &&
                typeof task.completed === "boolean"
        );
    }
} catch {
    tasks = [];
}

let currentFilter = "all";
let editingId = null;

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateSummary() {
    const done = tasks.filter(task => task.completed).length;

    totalTasks.textContent = tasks.length;
    completedTasks.textContent = done;
    remainingTasks.textContent = tasks.length - done;
}

function renderTasks() {
    taskList.replaceChildren();

    const search = searchInput.value.trim().toLowerCase();

    const visibleTasks = tasks.filter(task => {
        const matchesSearch = task.text.toLowerCase().includes(search);

        const matchesFilter =
            currentFilter === "all" ||
            (currentFilter === "active" && !task.completed) ||
            (currentFilter === "completed" && task.completed);

        return matchesSearch && matchesFilter;
    });

    visibleTasks.forEach(task => {
        const li = document.createElement("li");
        li.className = "task-item";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.setAttribute("aria-label", "Terminer la tâche");

        checkbox.addEventListener("change", () => {
            task.completed = checkbox.checked;
            saveTasks();
            renderTasks();
        });

        const name = document.createElement("span");
        name.className = "task-name";
        name.textContent = task.text;

        if (task.completed) {
            name.classList.add("completed");
        }

        const actions = document.createElement("div");
        actions.className = "task-actions";

        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.className = "edit-button";
        editButton.textContent = "Modifier";

        editButton.addEventListener("click", () => {
            taskInput.value = task.text;
            editingId = task.id;
            submitButton.textContent = "Enregistrer";
            taskInput.focus();
        });

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "delete-button";
        deleteButton.textContent = "Supprimer";

        deleteButton.addEventListener("click", () => {
            tasks = tasks.filter(item => item.id !== task.id);

            if (editingId === task.id) {
                resetForm();
            }

            saveTasks();
            renderTasks();
        });

        actions.append(editButton, deleteButton);
        li.append(checkbox, name, actions);
        taskList.appendChild(li);
    });

    emptyMessage.hidden = visibleTasks.length > 0;
    emptyMessage.textContent = tasks.length === 0
        ? "Aucune tâche pour le moment."
        : "Aucune tâche ne correspond à votre recherche.";

    updateSummary();
}

function resetForm() {
    editingId = null;
    taskForm.reset();
    submitButton.textContent = "Ajouter";
}

taskForm.addEventListener("submit", event => {
    event.preventDefault();

    const text = taskInput.value.trim();

    if (!text) {
        return;
    }

    if (editingId !== null) {
        const task = tasks.find(item => item.id === editingId);

        if (task) {
            task.text = text;
        }
    } else {
        tasks.push({
            id: crypto.randomUUID(),
            text: text,
            completed: false
        });
    }

    saveTasks();
    resetForm();
    renderTasks();
});

searchInput.addEventListener("input", renderTasks);

document.querySelectorAll(".filter").forEach(button => {
    button.addEventListener("click", () => {
        currentFilter = button.dataset.filter;

        document.querySelectorAll(".filter").forEach(item => {
            item.classList.toggle("active", item === button);
        });

        renderTasks();
    });
});

clearCompleted.addEventListener("click", () => {
    tasks = tasks.filter(task => !task.completed);

    if (editingId !== null && !tasks.some(task => task.id === editingId)) {
        resetForm();
    }

    saveTasks();
    renderTasks();
});

renderTasks();

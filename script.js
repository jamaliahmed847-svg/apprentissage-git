
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

taskForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const taskText = taskInput.value.trim();

    if (taskText === "") {
        return;
    }

    const li = document.createElement("li");

    const taskName = document.createElement("span");
    taskName.textContent = taskText;

    taskName.addEventListener("click", function() {
        taskName.classList.toggle("completed");
    });

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Supprimer";

    deleteButton.addEventListener("click", function() {
        li.remove();
    });

    li.appendChild(taskName);
    li.appendChild(document.createTextNode(" "));
    li.appendChild(deleteButton);
    taskList.appendChild(li);

    taskInput.value = "";
});

class Task {
    constructor(task, checked, id = null) {
        this.task = task;
        this.checked = checked;
        this.id = id;
    }
}


class taskList {
    static tasks = [];
    static addTaskToList = (task) => {
        if (!taskList.tasks.some(t => t.task === task.task && t.checked === task.checked && t.id === task.id)) {
            taskList.tasks.push(task);
        }
        const list = document.querySelector('.tasks-list');
        const item = document.createElement("li");
        item.id = task.id;
        item.classList.add("task");
        const content = document.createElement("div");
        content.classList.add("content");
        const checkbox = document.createElement("input");
        checkbox.setAttribute("type", "checkbox");
        if (task.checked) {
            checkbox.setAttribute("checked", "checked");
        }
        const label = document.createElement("label");
        label.textContent = task.task;
        const deleteButton = document.createElement("button");
        deleteButton.classList.add("delete");
        deleteButton.textContent = "Delete";
        content.appendChild(checkbox);
        content.appendChild(label);
        item.appendChild(content);
        item.appendChild(deleteButton);
        list.appendChild(item);
        document.getElementById("task").value = "";
        deleteButton.onclick = () => {
            taskList.removeTaskFromList(deleteButton.parentElement.id)
        };
        checkbox.onclick = () => {
            taskList.updateTask(checkbox.parentElement.parentElement.id);
        }
        store.saveTasks(taskList.tasks);
    }

    static removeTaskFromList = (taskToRemove) => {
        taskList.tasks = taskList.tasks.filter((task) => task.id !== parseInt(taskToRemove));
        const task = document.getElementById(`${taskToRemove}`);
        console.log(task);
        if (task) {
            task.parentNode.removeChild(task);
        }
        store.saveTasks(taskList.tasks);
    }

    static updateTask = (taskToUpdate) => {
        const task = taskList.tasks.find(t => t.id === parseInt(taskToUpdate));
        task.checked = !task.checked;
        store.saveTasks(taskList.tasks);
    }
}


class store {
    static saveTasks = (tasks) => {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    static getTasks = () => {
        return JSON.parse(localStorage.getItem("tasks"));
    }
}


document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    const task = document.getElementById("task").value;
    const newTaskId = taskList.tasks.length > 0 ? taskList.tasks[taskList.tasks.length - 1].id + 1 : 0;
    taskList.addTaskToList(new Task(task, false, newTaskId));
});

document.addEventListener('DOMContentLoaded', () => {
    const tasks = store.getTasks();
    if (tasks) {
        tasks.forEach(task => {
            taskList.addTaskToList(new Task(task.task, task.checked, task.id));
        });
    }
});
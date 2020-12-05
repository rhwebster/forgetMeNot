import {months, tagColors} from './data-arrays.js';

window.addEventListener("DOMContentLoaded", async (event) => {
    const taskContainer = document.getElementById("list-of-tasks");
    const addTaskButton = document.getElementById("add-task-button");
    const taskField = document.getElementById("task-name");
    const tagContainer = document.getElementById("list-of-tags-div");

    async function populateTasks(link = "/api/tasks", taskObject = {}) {
        try {
            const res = await fetch(link, taskObject);
            let { tasks } = await res.json();
            const taskHtml = [];
            let html;
            tasks.forEach((task) => {
                let tags = task.TasksWithTags;
                html = `<li class="filled"><span class="task-text">${task.name}</span>`;
                tags.forEach((tag) => {
                    html += `<span class="tag-class">${tag.name}</span>`;
                });
                if (task.due) {
                    const today = new Date();
                    const todayMonth = today.getMonth();
                    const todayDate = today.getDate();
                    const todayYear = today.getYear();
                    const date = new Date(task.due);
                    const month = date.getMonth();
                    const monthText = months[month];
                    const day = date.getDate();
                    const year = date.getYear();
                    if (day < todayDate) {
                        html += `<span class="overdue date-text">${monthText} ${day}</span>`;
                    } else if (
                        month === todayMonth &&
                        day === todayDate &&
                        year === todayYear
                    ) {
                        html += `<span class="today date-text">Today</span>`;
                    } else if (
                        month === todayMonth &&
                        day === todayDate + 1 &&
                        year === todayYear
                    ) {
                        html += `<span class="date-text">Tomorrow</span>`;
                    } else {
                        html += `<span class="date-text">${monthText} ${day}</span>`;
                    }
                }
                taskHtml.push(html);
            });
            for (let i = 0; i < 50 - tasks.length; i++) {
                taskHtml.push(`<li><span></span></li>`);
            }

            taskContainer.innerHTML = taskHtml.join("");
            const inboxLink = document.getElementById("inbox");
            const numTasksElement = document.createElement("span");
            numTasksElement.innerHTML = tasks.length;
            inboxLink.appendChild(numTasksElement);
        } catch (e) {
            console.error(e);
        }
    }
    const detailPanel = document.getElementById("task-detail-panel");
    const tasksClickable = document.querySelectorAll(".filled");
    const taskNameDetail = document.getElementById("task-name-detail");
    tasksClickable.forEach((taskEle) => {
        taskEle.addEventListener("click", async (event) => {
            const taskNameInput = document.getElementById("name-panel-text");
            const taskDueDate = document.getElementById("due-date-input");
            const currentList = document.getElementById("current-list");
            //   const taskNameInput = document.getElementById("name-panel-text");
            try {
                const id = taskEle.id.slice(4);
                console.log(id);
                const res = await fetch(`/api/tasks/${id}`);
                let { task } = await res.json();
                taskNameInput.value = task.name;
                taskDueDate.innerHTML = task.due;
                currentList.innerHTML = task.List.name;
            } catch (e) {
                console.error(e);
            }
            detailPanel.classList.remove("panel-hidden");
            detailPanel.classList.add("panel-shown");
        });
    });

    // populateTasks();

    const clickHandler = async (event) => {
        addTaskButton.classList.remove("shown");
        const value = taskField.value;
        const nameToSend = { name: value };
        try {
            const res = await fetch("/api/tasks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nameToSend),
            });
            let { tasks } = await res.json();
            const taskHtml = [];
            tasks.forEach((task) => {
                let tags = task.TasksWithTags;
                let html = `<li class="filled"><span class="task-text">${task.name}</span>`;
                tags.forEach((tag) => {
                    html += `<span class="tag-class">${tag.name}</span>`;
                });
                if (task.due) {
                    const today = new Date();
                    const todayMonth = today.getMonth();
                    const todayDate = today.getDate();
                    const todayYear = today.getYear();
                    const date = new Date(task.due);
                    const month = date.getMonth();
                    const monthText = months[month];
                    const day = date.getDate();
                    const year = date.getYear();
                    if (day < todayDate) {
                        html += `<span class="overdue date-text">${monthText} ${day}</span>`;
                    } else if (
                        month === todayMonth &&
                        day === todayDate &&
                        year === todayYear
                    ) {
                        html += `<span class="today date-text">Today</span>`;
                    } else if (
                        month === todayMonth &&
                        day === todayDate + 1 &&
                        year === todayYear
                    ) {
                        html += `<span class="date-text">Tomorrow</span>`;
                    } else {
                        html += `<span class="date-text">${monthText} ${day}</span>`;
                    }
                }
                taskHtml.push(html);
            });
            for (let i = 0; i < 50 - tasks.length; i++) {
                taskHtml.push(`<li><span></span></li>`);
            }
            taskContainer.innerHTML = taskHtml.join("");
            taskField.value = "";
            taskField.blur();
        } catch (e) {
            console.error(e);
        }
    };
    addTaskButton.addEventListener("click", clickHandler);
    taskField.addEventListener("keyup", (event) => {
        if (!taskField.value.length) {
            addTaskButton.removeEventListener("click", clickHandler);
        } else {
            addTaskButton.addEventListener("click", clickHandler);
        }
    });
    taskField.addEventListener("focus", (event) => {
        addTaskButton.removeEventListener("click", clickHandler);
        addTaskButton.classList.add("shown");
    });
    taskField.addEventListener("blur", (event) => {
        addTaskButton.classList.remove("shown");
    });

    addTaskButton.addEventListener("mousedown", (event) => {
        event.preventDefault();
    });

    async function populateTags(tagPostObject = {}) {
        try {
            const res = await fetch("/api/tags", tagPostObject);
            const resJson = await res.json();
            if (!res.ok) {
                const p = document.getElementById('p-add-errors');
                console.log(resJson.errors);
                p.innerText = resJson.errors.join("/br");
                return;
            }
            let { tags } = resJson;
            const tagHtml = [];
            tags.forEach((tag) => {
                let html = `<li id="li-${tag.name}">${tag.name} <button class="tag-button" id="btn-${tag.name}">X</button></li>`;
                tagHtml.push(html);
            });
            tagContainer.innerHTML = tagHtml.join("");
            tags.forEach((tag) => {
                document
                    .getElementById(`btn-${tag.name}`)
                    .addEventListener("click", async (event) => {
                        event.preventDefault();
                        try {
                            const res = await fetch(`/api/tags/${tag.name}`, {
                                method: "DELETE",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ name: tag.name }),
                            });
                            let { name } = await res.json();
                            console.log("json back", name);
                            const li = document.getElementById(`li-${name}`);
                            tagContainer.removeChild(li);
                        } catch (e) {
                            console.error(e);
                        }
                    });
            });
        } catch (e) {
            console.error(e);
        }
    }

    populateTags();
    // Get the modal
    const modal = document.getElementById("myModal");

    // Get the button that opens the modal
    const addTagBtn = document.getElementById("addTagBtn");
    const addListBtn = document.getElementById("addListBtn");

    const popupAddTagBtn = document.getElementById("addTag");

    popupAddTagBtn.addEventListener("click", async (event) => {
        event.preventDefault();
        const inputName = document.getElementById("inputName");
        const value = inputName.value;
        const nameToSend = { name: value };
        populateTags({
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nameToSend),
        });
        inputName.value = "";
        modal.style.display = "none";
    });

    // Get the <span> element that closes the modal
    const span = document.getElementsByClassName("close")[0];
    console.log("span", span);

    // When the user clicks the button, open the modal
    addTagBtn.onclick = function () {
        modal.style.display = "block";
    };
    addListBtn.onclick = function () {
        modal.style.display = "block";
    };

    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        modal.style.display = "none";
    }

    const searchButton = document.getElementById('searchButton');
    const searchText = document.getElementById('searchText');
    function searchAndDisplay() {
        event.preventDefault();
        let textToSearch = searchText.value;
        if (!textToSearch.length) textToSearch = "all";
        populateTasks(`/api/tasks/search/${textToSearch}`);
        searchText.value = "";
    }
    searchButton.addEventListener('click', event => {
        searchAndDisplay();
    });
    searchText.addEventListener('keydown', event => {
        if (event.key === 'Enter') {
            searchAndDisplay();
        }
    })
});

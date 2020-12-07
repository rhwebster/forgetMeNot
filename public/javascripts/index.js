import {
  months,
  tagColors,
  daysFullOfTheWeek,
  days3OfTheWeek,
} from "./data-arrays.js";

window.addEventListener("DOMContentLoaded", async (event) => {
  const taskContainer = document.getElementById("list-of-tasks");
  const addTaskButton = document.getElementById("add-task-button");
  const taskField = document.getElementById("task-name");
  const tagContainer = document.getElementById("list-of-tags-div");
  const listContainer = document.getElementById("list-of-lists-div");
  const detailPanel = document.getElementById("task-detail-panel");
  const taskNameInput = document.getElementById("name-panel-text");
  const noteList = document.getElementById("note-list");
  const tagsList = document.getElementById("tags-list");
  const currentList = document.getElementById("current-list");
  const tagSelector = document.getElementById("tag-selector");
  const listSelector = document.getElementById("list-selector");
  const dueDatePicker = document.getElementById("due-input");
  const dueDateHead = document.getElementById("due-text-enter");
  const addTaskDiv = document.getElementById("add-a-task-div");
  const addTaskOptions = document.getElementById("task-add-options");
  const dueInput = document.getElementById("due-input");
  const completeButton = document.getElementById("checkmark");
  const completedTab = document.getElementById("complete");
  const incompletedTab = document.getElementById("incomplete");
  const currentListHeader = document.getElementById("current-list-header");
  const sidePanel = document.getElementById("side-panel");
  const sideNavBar = document.getElementById("side-navbar");
  const topBars = document.getElementById("bars");
  const numTasksContainer = document.getElementById("num-tasks-container");
  const settingsButton = document.getElementById("settings");
  const settingsMenu = document.querySelector(".settings-menu");
  const sortCog = document.getElementById("sort-cog");
  const sortBox = document.getElementById("sort-box");
  const sortOptions = document.querySelectorAll(".sort-option");
  const selectOptions = document.querySelectorAll(".select-option");
  const sortChecks = document.querySelectorAll(".sort-check");
  const selectLogo = document.getElementById("selection-menu");
  const selectionBox = document.getElementById("selection-box");
  const alertWindow = document.getElementById("alert-window");
  const modalHeader = document.getElementById("modal-header");
  const modalCancel = document.getElementById("close-modal-cancel");
  const checkIcon = document.getElementById("check-logo");
  const deleteButton = document.getElementById("delete-tasks");
  let globalLink = "/api/tasks";
  let globalObject = {};
  let listForBody = null;
  let currentClicked;
  let completedFlag = false;
  let orderFlag = "1";
  let completeTasks = {};
  let deleteTasks = {};
  let numChecked = 0;
  let timesClicked = 0;
  let numTotalTasks = 0;
  let numDueToday = 0;
  let numDueTomorrow = 0;
  let numOverdue = 0;
  let numCompleted = 0;
  let numDueThisWeek = 0;
  let numDueNextWeek = 0;
  let inboxId;
  try {
    const res = await fetch("api/lists/inbox");
    const { list } = await res.json();
    inboxId = list.id;
  } catch (e) {
    console.error(e);
  }

  const sideDueInput = document.getElementById("side-due-input");
  const taskDueDateSpan = document.getElementById("due-date-input");

  let currentTask;
  let currentUser;
  let currentListForHeader;

  settingsButton.addEventListener("click", (event) => {
    event.stopPropagation();
    if (settingsMenu.classList.contains("menu-hidden")) {
      settingsMenu.classList.remove("menu-hidden");
    } else {
      settingsMenu.classList.add("menu-hidden");
    }
  });

  window.addEventListener("click", () => {
    settingsMenu.classList.add("menu-hidden");
  });

  sortCog.addEventListener("click", (event) => {
    event.stopPropagation();
    if (sortBox.classList.contains("hidden")) {
      sortBox.classList.remove("hidden");
    } else {
      sortBox.classList.add("hidden");
    }
  });

  selectLogo.addEventListener("click", (event) => {
    event.stopPropagation();
    if (selectionBox.classList.contains("hidden")) {
      selectionBox.classList.remove("hidden");
    } else {
      selectionBox.classList.add("hidden");
    }
  });

  window.addEventListener("click", () => {
    sortBox.classList.add("hidden");
  });

  window.addEventListener("click", () => {
    selectionBox.classList.add("hidden");
  });

  sortOptions.forEach((option) => {
    option.addEventListener("click", (event) => {
      orderFlag = event.target.classList[0];
      populateTasks(globalLink, globalObject);
    });
  });

  selectOptions.forEach((option) => {
    option.addEventListener("click", (event) => {
      let selectFlag = event.target.classList[0].slice(2);
      checkingBoxes(selectFlag);
    });
  });

  function checkingBoxes(flag) {
    console.log(flag);
    const checkboxes = document.querySelectorAll(".task-check-box");
    checkboxes.forEach((checkbox) => {
      let id = checkbox.id.slice(3);
      const ele = document.getElementById(`ele-${id}`);
      if (flag === "1") {
        numChecked++;
        ele.classList.add("checked-list");
        checkbox.checked = true;
        if (!completedFlag) {
          completeTasks[id] = true;
        } else {
          completeTasks[id] = false;
        }
        deleteTasks[id] = true;
      } else if (flag === "2") {
        checkbox.checked = false;
        ele.classList.remove("checked-list");
        numChecked = 0;
        if (!completedFlag) {
          completeTasks[id] = false;
        } else {
          completeTasks[id] = true;
        }
        deleteTasks[id] = false;
      }
    });
  }

  async function populateTasks(link = "/api/tasks", taskObject = {}) {
    numChecked = 0;
    completeButton.classList.remove("num-checked-pos");
    deleteButton.classList.remove("num-checked-pos");
    try {
      const res = await fetch(link, taskObject);
      let { tasks } = await res.json();
      if (taskObject.method === "POST" && globalLink === "/api/tasks") {
        globalObject = {};
      }

      let completedList = [];

      let incompleteList = [];
      tasks.forEach((task) => {
        if (task.completed) {
          completedList.push(task);
        } else {
          incompleteList.push(task);
        }
      });
      if ((incompleteList, length > 0)) {
        listForBody = incompleteList[0].listId;
      }

      incompleteList = sortTasks(incompleteList);
      completedList.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
      numTotalTasks = incompleteList.length;
      numCompleted = completedList.length;

      const taskHtml = [];
      let html;
      if (!completedFlag) {
        numDueTomorrow = 0;
        numDueToday = 0;
        numOverdue = 0;
        incompleteList.forEach((task) => {
          let tags = task.TasksWithTags;
          if (tags) {
            html = `<li id="ele-${task.id}" class="li-${task.id} filled"><div class="li-${task.id} left-border"></div><input class="li-${task.id} task-check-box" id="cb-${task.id}" type="checkbox"><span class="li-${task.id} task-text">${task.name}</span>`;
            tags.forEach((tag) => {
              html += `<span class="li-${
                task.id
              } no-color-tag-class" style="background-color:${
                tagColors[tag.id % 17]
              };">${tag.name}</span>`;
            });
          }

          if (task.due) {
            const date = new Date(task.due);
            const today = new Date();
            today.setHours(0, 0, 0);
            date.setHours(0, 0, 1);
            const todayMonth = today.getMonth();
            const todayDate = today.getDate();
            const todayYear = today.getYear();
            const month = date.getMonth();
            const monthText = months[month];
            const day = date.getDate();
            const year = date.getYear();
            if (date < today) {
              numOverdue++;
              html += `<span class="li-${task.id} overdue date-text">${monthText} ${day}</span>`;
            } else if (
              month === todayMonth &&
              day === todayDate &&
              year === todayYear
            ) {
              numDueToday++;
              html += `<span class="li-${task.id} today date-text">Today</span>`;
            } else if (
              month === todayMonth &&
              day === todayDate + 1 &&
              year === todayYear
            ) {
              numDueTomorrow++;
              html += `<span class="li-${task.id} date-text">Tomorrow</span>`;
            } else {
              html += `<span class="li-${task.id} date-text">${monthText} ${day}</span>`;
            }
          }
          taskHtml.push(html);
        });
      } else {
        completedList.forEach((task) => {
          let tags = task.TasksWithTags;
          if (tags) {
            html = `<li id="ele-${task.id}" class="li-${task.id} filled"><div class="li-${task.id} left-border"></div><input class="li-${task.id} task-check-box" id="cb-${task.id}" type="checkbox"><span class="li-${task.id} task-text complete-task">${task.name}</span>`;
            tags.forEach((tag) => {
              html += `<span class="li-${
                task.id
              } no-color-tag-class" style="background-color:${
                tagColors[tag.id % 17]
              };">${tag.name}</span>`;
            });
          }
          taskHtml.push(html);
        });
      }
      let numTasksHtml = `<div class="tasks-num-div" id="total-tasks-div"><span id="total-tasks-span">${numTotalTasks}</span><span class="num-tasks-label">tasks</span></div>`;
      if (numDueToday > 0) {
        numTasksHtml += `<div class="tasks-num-div" id="today-tasks-div"><span id="today-tasks-span">${numDueToday}</span><span class="num-tasks-label">due today</span></div>`;
      }
      if (numDueTomorrow > 0) {
        numTasksHtml += `<div class="tasks-num-div" id="tomorrow-tasks-div"><span id="tomorrow-tasks-span">${numDueTomorrow}</span><span class="num-tasks-label">due tomorrow</span></div>`;
      }
      if (numOverdue > 0) {
        numTasksHtml += `<div class="tasks-num-div" id="overdue-tasks-div"><span id="overdue-tasks-span">${numOverdue}</span><span class="num-tasks-label">overdue</span></div>`;
      }
      if (numCompleted > 0) {
        numTasksHtml += `<div class="tasks-num-div" id="completed-tasks-div"><span id="completed-tasks-span">${numCompleted}</span><span class="completed-tasks-label">completed</span></div>`;
      }
      numTasksContainer.innerHTML = numTasksHtml;
      for (let i = 0; i < 100 - tasks.length; i++) {
        taskHtml.push(`<li><span></span></li>`);
      }

      taskContainer.innerHTML = taskHtml.join("");
      const inboxLink = document.getElementById("inbox");
      inboxLink.innerHTML = '<span style="font-weight:bold;">Inbox</span>';
      const numTasksElement = document.createElement("span");
      numTasksElement.classList.add("num-tasks");
      numTasksElement.innerHTML = incompleteList.length;
      inboxLink.innerHTML =
        "<a class='timed-list' id='inbox-link' href='/'  style='font-weight:bold;'>Inbox</a>";
      inboxLink.appendChild(numTasksElement);
    } catch (e) {
      console.error(e);
    }
    const checkboxes = document.querySelectorAll(".task-check-box");
    completeTasks = {};
    deleteTasks = {};
    checkboxes.forEach((checkbox) => {
      let id = checkbox.id.slice(3);
      deleteTasks[id] = false;
      if (completedFlag === false) {
        completeTasks[id] = false;
      } else {
        completeTasks[id] = true;
      }
    });

    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener("click", (event) => {
        let id = event.target.id.slice(3);
        const ele = document.getElementById(`ele-${id}`);
        if (checkbox.checked) {
          numChecked++;
          ele.classList.add("checked-list");
          if (completedFlag === false) {
            completeTasks[id] = true;
          } else {
            completeTasks[id] = false;
          }
          deleteTasks[id] = true;
        } else {
          numChecked--;
          ele.classList.remove("checked-list");
          if (completedFlag === false) {
            completeTasks[id] = false;
          } else {
            completeTasks[id] = true;
          }
          deleteTasks[id] = false;
        }
        if (numChecked > 0) {
          detailPanel.classList.add("button-checked");
          completeButton.classList.add("num-checked-pos");
          deleteButton.classList.add("num-checked-pos");
        } else {
          completeButton.classList.remove("num-checked-pos");
          deleteButton.classList.remove("num-checked-pos");
        }

        console.log(deleteTasks);
      });
    });

    const tasksClickable = document.querySelectorAll(".filled");

    // const taskNameDetail = document.getElementById("task-name-detail");
    tasksClickable.forEach((taskEle) => {
      if (!completedFlag) {
        let children = taskEle.childNodes;
        if (children[3]) {
          if (
            children[children.length - 1].classList.contains("today") ||
            children[children.length - 1].classList.contains("overdue")
          ) {
            children[2].classList.add("text-bold");
          }
        }
      }
      taskEle.addEventListener("click", async (event) => {
        const id = event.target.classList[0].slice(3);
        timesClicked++;
        if (event.target.type !== "checkbox") {
          detailPanel.classList.remove("button-checked");
        }

        const cb = document.getElementById(`cb-${id}`);
        // if (cb.checked) {
        //   taskEle.classList.remove("checked-list");
        //   cb.checked = false;
        // } else {
        //   taskEle.classList.add("checked-list");
        //   cb.checked = true;
        // }
        // taskDueDateSpan.innerHTML = "";
        // currentList.innerHTML = "";
        // noteList.innerHTML = "";
        //   const taskNameInput = document.getElementById("name-panel-text");
        try {
          const res = await fetch(`/api/tasks/${id}`);
          let { task } = await res.json();
          currentTask = task;
          taskNameInput.value = task.name;
          if (task.due) {
            let dateHtml = new Date(task.due).toDateString();
            taskDueDateSpan.innerHTML = dateHtml;
          }

          currentList.innerHTML = task.List.name;
          currentListForHeader = currentTask.List.name;
          if (globalLink === "/api/tasks/all") {
            currentListHeader.innerHTML = "All Tasks";
          } else {
            currentListHeader.innerHTML = currentListForHeader;
          }

          populateNotes();

          let html = "";
          currentTask.TasksWithTags.forEach((tag) => {
            html += `<span class="no-color-tag-class remove-tag" style="background-color:${
              tagColors[tag.id % 17]
            };">${tag.name}<span class="x-button" id="${currentTask.id}tt${
              tag.id
            }">  x</span></span>`;
          });

          tagsList.innerHTML = html;
          const xTagButtons = document.querySelectorAll(".x-button");
          xTagButtons.forEach((button) => {
            button.addEventListener("click", (event) => {
              removeTag(button);
            });
          });
        } catch (e) {
          console.error(e);
        }
        if (currentClicked === id && timesClicked % 2 === 0) {
          detailPanel.classList.add("panel-hidden");
          detailPanel.classList.remove("panel-shown");
          timesClicked = 0;
        } else {
          detailPanel.classList.remove("panel-hidden");
          detailPanel.classList.add("panel-shown");
        }
        currentClicked = id;
        listSelector.value = currentTask.List.id;
      });
    });
  }

  populateTasks(globalLink);
  currentListForHeader = "Inbox";
  currentListHeader.innerHTML = currentListForHeader;
  completeButton.addEventListener("click", (event) => {
    markComplete(completeTasks);
  });
  deleteButton.addEventListener("click", (event) => {
    deleteSelected(deleteTasks);
  });
  topBars.addEventListener("click", (event) => {
    if (sideNavBar.classList.contains("hidden")) {
      sideNavBar.classList.remove("hidden");
    } else {
      sideNavBar.classList.add("hidden");
    }
  });
  completedTab.addEventListener("click", (event) => {
    completedFlag = true;
    checkIcon.classList.add("fa-history");
    checkIcon.classList.remove("fa-check");
    incompletedTab.classList.remove("selected");
    completedTab.classList.add("selected");
    addTaskDiv.classList.add("hidden");
    detailPanel.classList.remove("panel-shown");
    detailPanel.classList.add("panel-hidden");
    timesClicked = 0;
    if (globalLink == "/api/tasks/all") {
      globalObject = {};
    }
    populateTasks(globalLink, globalObject);
  });
  incompletedTab.addEventListener("click", (event) => {
    completedFlag = false;
    checkIcon.classList.remove("fa-history");
    checkIcon.classList.add("fa-check");
    incompletedTab.classList.add("selected");
    completedTab.classList.remove("selected");
    addTaskDiv.classList.remove("hidden");
    detailPanel.classList.remove("panel-shown");
    detailPanel.classList.add("panel-hidden");
    timesClicked = 0;
    if (globalLink == "/api/tasks/all") {
      globalObject = {};
    }
    populateTasks(globalLink, globalObject);
  });
  const closeButton = document.getElementById("close-button-panel");
  closeButton.addEventListener("click", (event) => {
    detailPanel.classList.remove("panel-shown");
    detailPanel.classList.add("panel-hidden");
    timesClicked = 0;
  });

  const updateTaskName = async (updatedName, taskId) => {
    const nameToSend = { name: updatedName };
    try {
      const res = await fetch(`/api/tasks/${taskId}/edit`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nameToSend),
      });
      let { task } = await res.json();
      taskNameInput.addEventListener("keypress", keyPressEvent);
      populateTasks(globalLink, globalObject);
      let newTaskName = task.name;
      alertWindow.innerHTML = `Task renamed to ${newTaskName}<span id="alert-close" class="fa">&#xf00d</span>`;
      alertWindow.classList.remove("hidden");
      closeWindow();
    } catch (e) {
      console.error(e);
    }
  };

  taskNameInput.addEventListener("keypress", keyPressEvent);

  function keyPressEvent(event) {
    if (
      event.key === "Enter" &&
      taskNameInput.value !== currentTask.name &&
      taskNameInput.value !== ""
    ) {
      updateTaskName(taskNameInput.value, currentTask.id);
    }
  }
  const clickHandler = async (event) => {
    addTaskButton.classList.remove("shown");
    dueDatePicker.classList.remove("shown");
    dueDateHead.classList.remove("shown");
    addTaskOptions.classList.remove("shown");
    const value = taskField.value;
    let dueInputValue = dueInput.value;

    if (dueInputValue.length === 0) {
      dueInputValue = null;
    }
    dueInput.value = "";
    const nameToSend = { name: value, due: dueInputValue, listId: listForBody };
    try {
      taskField.value = "";
      taskField.blur();
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nameToSend),
      });
      let { task } = await res.json();

      alertWindow.innerHTML = `Task "${task.name}" added to "${task.List.name}"<span id="alert-close" class="fa">&#xf00d</span>`;
      alertWindow.classList.remove("hidden");
      closeWindow();

      populateTasks(globalLink, globalObject);
    } catch (e) {
      console.error(e);
    }
  };
  const saveNoteButton = document.getElementById("add-note-button");
  const noteField = document.getElementById("notes-input");
  //   saveNoteButton
  const noteHandler = async (event) => {
    let notes = [];
    const value = noteField.value;
    if (currentTask.notes === "RESERVED") {
      notes.push(`****${value}`);
    } else {
      notes = [...currentTask.notes.split("****")];
      notes.push(value);
    }
    const noteToSend = notes.join("****");
    saveNoteButton.classList.remove("shown");
    try {
      const res = await fetch(`/api/tasks/${currentTask.id}/edit`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: noteToSend }),
      });
      let { task } = await res.json();
      currentTask.notes = task.notes;
      noteField.value = "";
      noteField.blur();

      //   currentTask.notes = await res.json().notes;
    } catch (e) {
      console.error(e);
    }

    populateNotes();
  };

  saveNoteButton.addEventListener("click", noteHandler);
  noteField.addEventListener("keyup", (event) => {
    if (!noteField.value.length) {
      saveNoteButton.removeEventListener("click", noteHandler);
    } else {
      saveNoteButton.addEventListener("click", noteHandler);
    }
  });
  noteField.addEventListener("focus", (event) => {
    saveNoteButton.removeEventListener("click", noteHandler);
    saveNoteButton.classList.add("shown");
  });
  noteField.addEventListener("blur", (event) => {
    saveNoteButton.classList.remove("shown");
  });

  saveNoteButton.addEventListener("mousedown", (event) => {
    event.preventDefault();
  });

  addTaskOptions.addEventListener("mousedown", (event) => {
    event.preventDefault();
  });

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
    addTaskOptions.classList.add("shown");
    dueDateHead.classList.add("shown");
    dueDatePicker.classList.add("shown");
  });
  taskField.addEventListener("blur", (event) => {
    addTaskOptions.classList.remove("shown");
    addTaskButton.classList.remove("shown");
    dueDateHead.classList.remove("shown");
    dueDatePicker.classList.remove("shown");
  });

  taskField.addEventListener("keydown", (event) => {
    if (event.key == "Enter") {
      addTaskButton.click();
    }
  });

  addTaskButton.addEventListener("mousedown", (event) => {
    event.preventDefault();
  });

  async function populateTags(tagPostObject = {}) {
    let tagId = undefined;
    try {
      const res = await fetch("/api/tags", tagPostObject);
      const resJson = await res.json();
      if (!res.ok) {
        const p = document.getElementById("p-add-errors");
        console.log(resJson.errors);
        p.innerText = resJson.errors.join("/br");
        return tagId;
      }
      let { tags } = resJson;
      const tagHtml = [];

      tags.forEach((tag) => {
        let html = `<li class="left-link" id="li-${
          tag.id
        }"><div class="left-tag-div"><div class="color-tag" style="background-color:${
          tagColors[tag.id % 17]
        };"></div><span>${
          tag.name
        }</span></div><button class="tag-button" id="btn-${
          tag.id
        }"><span class="tag-button-text">-</span></button></li>`;
        tagHtml.push(html);
        const option = document.getElementById(`option-${tag.id}`);
        if (option) option.style = `background-color:${tagColors[tag.id % 17]}`;
      });
      tagContainer.innerHTML = tagHtml.join("");
      tagId = tags[tags.length - 1].id;

      tags.forEach((tag) => {
        document
          .getElementById(`btn-${tag.id}`)
          .addEventListener("click", async (event) => {
            event.preventDefault();
            try {
              const res = await fetch(`/api/tags/${tag.id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: tag.id }),
              });
              let { id } = await res.json();
              // console.log("json back", id);
              const li = document.getElementById(`li-${id}`);
              const option = document.getElementById(`option-${id}`);
              // console.log(option);
              tagContainer.removeChild(li);
              tagSelector.removeChild(option);
            } catch (e) {
              console.error(e);
            }
          });
        document
          .getElementById(`li-${tag.id}`)
          .addEventListener("click", (event) => {
            console.log(tag.name);
            currentListHeader.innerHTML = tag.name;
            const leftLinks = document.querySelectorAll(".left-link");
            leftLinks.forEach((link) => {
              link.classList.remove("highlighted");
            });
            document
              .getElementById(`li-${tag.id}`)
              .classList.add("highlighted");
            event.preventDefault();
            listForBody = inboxId;
            searchAndDisplay(tag.id);
          });
      });
    } catch (e) {
      console.error(e);
    }
    return tagId;
  }

  populateTags();
  // Get the modal
  const modal = document.getElementById("myModal");

  let addFunction;
  // Get the button that opens the modal
  const addTagBtn = document.getElementById("addTagBtn");
  const addListBtn = document.getElementById("addListBtn");
  const inputName = document.getElementById("inputName");

  const popupAddTagBtn = document.getElementById("addTagOrList");

  popupAddTagBtn.addEventListener("click", async (event) => {
    event.preventDefault();
    const value = inputName.value;
    const nameToSend = { name: value };

    if (addFunction === "addTag") {
      const tagId = await populateTags({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nameToSend),
      });
      if (tagId > 0) {
        // add this new tag to the select tagSelector
        const newTagOption = document.createElement("option");
        newTagOption.value = tagId;
        newTagOption.id = `option-${tagId}`;
        newTagOption.text = inputName.value;
        newTagOption.style = `background-color:${tagColors[tagId % 17]}`;
        tagSelector.add(newTagOption);
        // console.log(newTagOption);
        inputName.value = "";
        modal.style.display = "none";
      }
    } else if (addFunction === "addList") {
      const listId = await populateLists({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nameToSend),
      });
      if (listId > 0) {
        // add this new tag to the select tagSelector
        const newListOption = document.createElement("option");
        newListOption.value = listId;
        newListOption.id = `option-list-${listId}`;
        newListOption.text = inputName.value;
        // newListOption.style = `background-color:${tagColors[tagId % 17]}`;
        listSelector.add(newListOption);
        // console.log(newTagOption);
        inputName.value = "";
        modal.style.display = "none";
      }
    }
  });

  // Get the <span> element that closes the modal
  const span = document.getElementsByClassName("close")[0];

  // When the user clicks the button, open the modal
  addTagBtn.onclick = function () {
    detailPanel.classList.add("panel-hidden");
    detailPanel.classList.remove("panel-shown");
    modal.style.display = "block";
    modalHeader.innerText = "Add a tag";
    inputName.focus();
    addFunction = "addTag";
    timesClicked = 0;
  };
  addListBtn.onclick = function () {
    detailPanel.classList.add("panel-hidden");
    detailPanel.classList.remove("panel-shown");
    modal.style.display = "block";
    modalHeader.innerText = "Add a list";
    inputName.focus();
    addFunction = "addList";
    timesClicked = 0;
  };
  // addListBtn.onclick = function () {
  //   modal.style.display = "block";
  //   popupAddListBtn.innerText = "Add List";
  //   inputName.focus();
  // };

  // When the user clicks on <span> (x), close the modal
  span.onclick = function () {
    modal.style.display = "none";
  };

  modalCancel.onclick = function (event) {
    event.preventDefault();
    modal.style.display = "none";
  };

  const searchButton = document.getElementById("searchButton");

  const searchText = document.getElementById("searchText");
  function searchAndDisplay(tagName = "") {
    event.preventDefault();
    timesClicked = 0;
    detailPanel.classList.add("panel-hidden");
    detailPanel.classList.remove("panel-shown");
    let textToSearch = searchText.value;
    if (!textToSearch.length) textToSearch = "all";
    globalLink = `/api/tasks/search/${textToSearch}/${tagName}`;
    globalObject = {};

    if (tagName === "") {
      currentListHeader.innerHTML = `Search results for ${textToSearch}`;
    }
    populateTasks(`/api/tasks/search/${textToSearch}/${tagName}`);
    searchText.value = "";
  }
  searchButton.addEventListener("click", (event) => {
    searchAndDisplay();
  });
  searchText.addEventListener("focus", (event) => {
    searchButton.classList.add("focused");
  });
  searchText.addEventListener("blur", (event) => {
    searchButton.classList.remove("focused");
  });
  searchText.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      searchAndDisplay();
    }
  });
  function populateNotes() {
    if (currentTask.notes === null) {
      currentTask.notes = "RESERVED";
      return;
    }

    const notesArr = currentTask.notes.split("****");
    noteList.innerHTML = "";

    for (let i = 1; i < notesArr.length; i++) {
      noteList.innerHTML += `<li class="notes-list-item">${notesArr[i]}</li>`;
    }
  }
  async function removeTag(tagButton) {
    const ids = tagButton.id;
    const idsArr = ids.split("tt");
    const taskIdWithTag = idsArr[0];
    const tagIdWithTag = idsArr[1];

    try {
      const res = await fetch(
        `/api/tasks/${taskIdWithTag}/tag/${tagIdWithTag}/delete`,
        {
          method: "DELETE",
        }
      );
      let html = "";
      const { task } = await res.json();
      currentTask = task;
      currentTask.TasksWithTags.forEach((tag) => {
        html += `<span class="no-color-tag-class remove-tag" style="background-color:${
          tagColors[tag.id % 17]
        };">${tag.name}<span class="x-button" id="${currentTask.id}tt${
          tag.id
        }">  x</span></span>`;
      });
      tagsList.innerHTML = html;
      const xTagButtons = document.querySelectorAll(".x-button");
      xTagButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
          removeTag(button);
        });
      });
      populateTasks(globalLink, globalObject);
      //   currentTask.notes = await res.json().notes;
    } catch (e) {
      console.error(e);
    }
  }

  // tagSelector.addEventListener('click', event => {
  //   // console.log('click', event);
  // });
  tagSelector.addEventListener("change", async (event) => {
    const tagId = tagSelector.value;
    try {
      const res = await fetch(`/api/tasks/${currentTask.id}/edit`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tagId }),
      });
      let html = "";
      const { task } = await res.json();
      currentTask = task;
      currentTask.TasksWithTags.forEach((tag) => {
        html += `<span class="no-color-tag-class remove-tag" style="background-color:${
          tagColors[tag.id % 17]
        };">${tag.name}<span class="x-button" id="${currentTask.id}tt${
          tag.id
        }">  x</span></span>`;
      });
      tagsList.innerHTML = html;
      const xTagButtons = document.querySelectorAll(".x-button");
      xTagButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
          removeTag(button);
        });
      });
      tagSelector.value = "";
      populateTasks(globalLink, globalObject);
    } catch (e) {}
  });
  sideDueInput.addEventListener("change", async (event) => {
    const newDueDate = new Date(sideDueInput.value);
    try {
      const res = await fetch(`/api/tasks/${currentTask.id}/edit`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ due: newDueDate }),
      });
      let { task } = await res.json();
      populateTasks(globalLink, globalObject);
      const taskDueDate = new Date(task.due);
      const newDate = new Date(
        taskDueDate.getTime() +
          Math.abs(taskDueDate.getTimezoneOffset() * 60000)
      ).toDateString();
      let dateHtml = newDate;
      taskDueDateSpan.innerHTML = dateHtml;
      currentTask.due = task.due;
      alertWindow.innerHTML = `Due date for "${task.name}" changed to ${dateHtml}<span id="alert-close" class="fa">&#xf00d</span>`;
      alertWindow.classList.remove("hidden");
      closeWindow();
    } catch (e) {
      console.log(e);
    }
  });

  const allTaskLink = document.getElementById("all-tasks");
  const todayLink = document.getElementById("today");
  const tomorrowLink = document.getElementById("tomorrow");
  const thisWeekLink = document.getElementById("this-week");
  const nextWeekLink = document.getElementById("next-week");

  allTaskLink.addEventListener("click", () => {
    const leftLinks = document.querySelectorAll(".left-link");
    leftLinks.forEach((link) => {
      link.classList.remove("highlighted");
    });
    allTaskLink.classList.add("highlighted");
    listForBody = inboxId;
    currentListHeader.innerHTML = "All Tasks";
    detailPanel.classList.add("panel-hidden");
    detailPanel.classList.remove("panel-shown");
    timesClicked = 0;
    globalLink = "/api/tasks/all";
    globalObject = {};
    populateTasks("/api/tasks/all");
  });
  todayLink.addEventListener("click", (event) => {
    const leftLinks = document.querySelectorAll(".left-link");
    leftLinks.forEach((link) => {
      link.classList.remove("highlighted");
    });
    todayLink.classList.add("highlighted");
    listForBody = inboxId;
    currentListHeader.innerHTML = "Today";
    timesClicked = 0;
    detailPanel.classList.add("panel-hidden");
    detailPanel.classList.remove("panel-shown");
    fetchDateLink(new Date());
  });
  tomorrowLink.addEventListener("click", (event) => {
    const leftLinks = document.querySelectorAll(".left-link");
    leftLinks.forEach((link) => {
      link.classList.remove("highlighted");
    });
    tomorrowLink.classList.add("highlighted");
    listForBody = inboxId;
    timesClicked = 0;
    currentListHeader.innerHTML = "Tomorrow";
    detailPanel.classList.add("panel-hidden");
    detailPanel.classList.remove("panel-shown");
    const tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    fetchDateLink(tomorrowDate);
  });
  thisWeekLink.addEventListener("click", (event) => {
    const leftLinks = document.querySelectorAll(".left-link");
    leftLinks.forEach((link) => {
      link.classList.remove("highlighted");
    });
    thisWeekLink.classList.add("highlighted");
    listForBody = inboxId;
    timesClicked = 0;
    currentListHeader.innerHTML = "This Week";
    detailPanel.classList.add("panel-hidden");
    detailPanel.classList.remove("panel-shown");
    fetchDateLink(new Date(), true);
  });
  nextWeekLink.addEventListener("click", (event) => {
    const leftLinks = document.querySelectorAll(".left-link");
    leftLinks.forEach((link) => {
      link.classList.remove("highlighted");
    });
    nextWeekLink.classList.add("highlighted");
    listForBody = inboxId;
    timesClicked = 0;
    currentListHeader.innerHTML = "Next Week";
    detailPanel.classList.add("panel-hidden");
    detailPanel.classList.remove("panel-shown");
    fetchDateLink(new Date(), false, true);
  });
  function fetchDateLink(date, thisweek = false, nextWeek = false) {
    let due = new Date(date.toLocaleDateString()).toISOString().slice(0, 10);
    if (thisweek || nextWeek) {
      let days = 0;
      if (nextWeek) days = 7;
      const sundayOfTheWeek = date;
      sundayOfTheWeek.setDate(date.getDate() + days - date.getDay());
      due = new Date(sundayOfTheWeek.toLocaleDateString())
        .toISOString()
        .slice(0, 10);
      const saturdayOfTheWeek = date;
      saturdayOfTheWeek.setDate(date.getDate() + 6 + days - date.getDay());
      due +=
        "to" +
        new Date(saturdayOfTheWeek.toLocaleDateString())
          .toISOString()
          .slice(0, 10);
    }
    globalLink = `/api/tasks/search/all`;
    globalObject = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ due }),
    };
    detailPanel.classList.add("panel-hidden");
    detailPanel.classList.remove("panel-shown");
    timesClicked = 0;
    populateTasks(`/api/tasks/search/all`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ due }),
    });
  }
  function sortTasks(tasks) {
    switch (orderFlag) {
      case "1":
        tasks.sort(
          (a, b) =>
            (a.due === null) - (b.due === null) ||
            +(a.due > b.due) ||
            -(a.due < b.due)
        );
        break;
      case "2":
        tasks.sort(
          (a, b) =>
            (b.due === null) - (a.due === null) ||
            -(a.due > b.due) ||
            +(a.due < b.due)
        );
        break;
      case "3":
        tasks.sort((a, b) => (a.name > b.name ? 1 : -1));
        break;
      case "4":
        tasks.sort((a, b) => (a.name > b.name ? -1 : 1));
        break;
      case "5":
        tasks.sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1));
        break;
      case "6":
        tasks.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
        break;
    }
    sortChecks.forEach((check) => {
      if (check.classList.contains(orderFlag)) {
        check.classList.remove("hidden");
      } else {
        check.classList.add("hidden");
      }
    });
    return tasks;
  }

  populateLists();
  async function populateLists(listPostObject = {}) {
    let listId = undefined;
    try {
      const res = await fetch("/api/lists", listPostObject);
      const resJson = await res.json();
      if (!res.ok) {
        const p = document.getElementById("p-add-errors");
        console.log(resJson.errors);
        p.innerText = resJson.errors.join("/br");
        return listId;
      }
      let { lists } = resJson;
      const listHtml = [];

      lists.forEach((list) => {
        let html = `<li class="left-link "id="li-list-${list.id}"><div class="left-list-div"><div class="color-list"></div><span>${list.name}</span></div><button class="tag-button" id="btn-list-${list.id}"><span class="tag-button-text">-</span></button></li>`;
        listHtml.push(html);
      });
      listContainer.innerHTML = listHtml.join("");
      listId = lists[lists.length - 1].id;

      lists.forEach((list) => {
        document
          .getElementById(`btn-list-${list.id}`)
          .addEventListener("click", async (event) => {
            event.preventDefault();
            try {
              const res = await fetch(`/api/lists/${list.id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: list.id }),
              });
              let { id } = await res.json();
              // console.log("json back", id);
              const li = document.getElementById(`li-list-${id}`);
              const option = document.getElementById(`option-list-${id}`);
              // console.log(option);
              listContainer.removeChild(li);
              listSelector.removeChild(option);
            } catch (e) {
              console.error(e);
            }
          });
        document
          .getElementById(`li-list-${list.id}`)
          .addEventListener("click", (event) => {
            const leftLinks = document.querySelectorAll(".left-link");
            leftLinks.forEach((link) => {
              link.classList.remove("highlighted");
            });
            globalObject = {};
            event.preventDefault();
            document
              .getElementById(`li-list-${list.id}`)
              .classList.add("highlighted");
            globalLink = `/api/lists/${list.id}`;
            detailPanel.classList.add("panel-hidden");
            detailPanel.classList.remove("panel-shown");
            timesClicked = 0;
            populateTasks(globalLink);
            listForBody = list.id;
            currentListHeader.innerHTML = list.name;
          });
      });
    } catch (e) {
      console.error(e);
    }
    return listId;
  }

  listSelector.addEventListener("change", async (event) => {
    const listId = listSelector.value;
    let oldList = currentTask.List.name;
    try {
      const res = await fetch(`/api/tasks/${currentTask.id}/edit`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listId }),
      });
      let html = "";
      const { task, listName } = await res.json();
      currentTask = task;
      //   currentTask.TasksWithTags.forEach((tag) => {
      //     html += `<span class="no-color-tag-class remove-tag" style="background-color:${
      //       tagColors[tag.id % 17]
      //     };">${tag.name}<span class="x-button" id="${currentTask.id}tt${
      //       tag.id
      //     }">  x</span></span>`;
      //   });
      //   tagsList.innerHTML = html;
      //   const xTagButtons = document.querySelectorAll(".x-button");
      //   xTagButtons.forEach((button) => {
      //     button.addEventListener("click", (event) => {
      //       removeTag(button);
      //     });
      //   });
      currentList.innerText = listName;
      alertWindow.innerHTML = `Task "${task.name}" moved from "${oldList}" to "${listName}"<span id="alert-close" class="fa">&#xf00d</span>`;
      alertWindow.classList.remove("hidden");
      closeWindow();
      timesClicked = 0;
      detailPanel.classList.add("panel-hidden");
      detailPanel.classList.remove("panel-shown");
      populateTasks(globalLink, globalObject);
    } catch (e) {}
  });
  function closeWindow() {
    document
      .getElementById("alert-close")
      .addEventListener("click", (event) => {
        alertWindow.classList.add("hidden");
      });
    setTimeout(() => {
      alertWindow.classList.add("hidden");
    }, 6000);
  }

  async function markComplete(completeTasks) {
    let amount = 0;
    for (let task in completeTasks) {
      const completed = completeTasks[task];
      if (completed) {
        amount++;
      }
      try {
        const res = await fetch(`/api/tasks/${task}/edit`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ completed }),
        });
      } catch (e) {
        console.error(e);
      }
    }
    if (!completedFlag) {
      if (amount === 1) {
        alertWindow.innerHTML = `You completed this task<span id="alert-close" class="fa">&#xf00d</span>`;
        alertWindow.classList.remove("hidden");
        closeWindow();
      } else if (amount > 1) {
        alertWindow.innerHTML = `You completed ${amount} tasks. Nice!<span id="alert-close" class="fa">&#xf00d</span>`;
        alertWindow.classList.remove("hidden");
        closeWindow();
      }
    }
    timesClicked = 0;
    detailPanel.classList.add("panel-hidden");
    detailPanel.classList.remove("panel-shown");
    populateTasks(globalLink, globalObject);
  }

  async function deleteSelected(tasks) {
    let amount = 0;
    for (let task in tasks) {
      const deleted = tasks[task];
      if (deleted) {
        try {
          const res = await fetch(`/api/tasks/${task}`, {
            method: "DELETE",
          });
          amount++;
        } catch (e) {
          console.error(e);
        }
      }
    }
    if (amount === 1) {
      alertWindow.innerHTML = `Successfully deleted ${amount} task<span id="alert-close" class="fa">&#xf00d</span>`;
      alertWindow.classList.remove("hidden");
      closeWindow();
    } else if (amount > 1) {
      alertWindow.innerHTML = `Successfully deleted ${amount} tasks<span id="alert-close" class="fa">&#xf00d</span>`;
      alertWindow.classList.remove("hidden");
      closeWindow();
    }
    timesClicked = 0;
    detailPanel.classList.add("panel-hidden");
    detailPanel.classList.remove("panel-shown");
    populateTasks(globalLink, globalObject);
  }
});

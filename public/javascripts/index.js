import { months, tagColors, daysFullOfTheWeek, days3OfTheWeek } from './data-arrays.js';

window.addEventListener("DOMContentLoaded", async (event) => {
  const taskContainer = document.getElementById("list-of-tasks");
  const addTaskButton = document.getElementById("add-task-button");
  const taskField = document.getElementById("task-name");
  const tagContainer = document.getElementById("list-of-tags-div");
  const detailPanel = document.getElementById("task-detail-panel");
  const taskNameInput = document.getElementById("name-panel-text");
  const noteList = document.getElementById("note-list");
  const tagsList = document.getElementById("tags-list");
  const tagSelector = document.getElementById("tag-selector");
  const dueDatePicker = document.getElementById("due-input");
  const dueDateHead = document.getElementById("due-text-enter");
  const addTaskOptions = document.getElementById("task-add-options");
  const dueInput = document.getElementById("due-input");

  const completeButton = document.getElementById("checkmark");
  const completedTab = document.getElementById("complete");
  const incompletedTab = document.getElementById("incomplete");
  const textComplete = document.getElementById("mark-complete");
  let completedFlag = false;
  let completeTasks = {};

  const sideDueInput = document.getElementById("side-due-input");
  const taskDueDateSpan = document.getElementById("due-date-input");  

  let currentTask;
  let currentUser;
  let currentList;

  async function populateTasks(link = "/api/tasks", taskObject = {}) {
    try {
      const res = await fetch(link, taskObject);
      let { tasks } = await res.json();
      const completedList = [];
      const incompleteList = [];
      tasks.forEach((task) => {
        let tags = task.TasksWithTags;
        if (tags) {
          let html = `<li id="ele-${task.id}" class="filled"><div class="left-border"></div><input class="task-check-box" type="checkbox"><span class="task-text">${task.name}</span>`;
          tags.forEach((tag) => {
            html += `<span class="no-color-tag-class" style="background-color:${tagColors[tag.id % 17]};">${tag.name}</span>`;
          });
        }
        console.log(task.completed);
        if (task.completed) {
          completedList.push(task);
        } else {
          incompleteList.push(task);
        }
      });
      const taskHtml = [];
      let html;
      if (!completedFlag) {
        incompleteList.forEach((task) => {
          let tags = task.TasksWithTags;
          if (tags) {
            html = `<li id="ele-${task.id}" class="filled"><div class="left-border"></div><input class="task-check-box" id="cb-${task.id}" type="checkbox"><span class="task-text">${task.name}</span>`;
            tags.forEach((tag) => {
              html += `<span class="no-color-tag-class" style="background-color:${tagColors[tag.id % 17]};">${tag.name}</span>`;
            });
          }

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
      } else {
        completedList.forEach((task) => {
          let tags = task.TasksWithTags;
          if (tags) {
            html = `<li id="ele-${task.id}" class="filled"><div class="left-border"></div><input class="task-check-box" id="cb-${task.id}" type="checkbox"><span class="task-text complete-task">${task.name}</span>`;
            tags.forEach((tag) => {
              html += `<span class="tag-class">${tag.name}</span>`;
            });
          }
          taskHtml.push(html);
        });
      }
      for (let i = 0; i < 100 - tasks.length; i++) {
        taskHtml.push(`<li><span></span></li>`);
      }
      taskContainer.innerHTML = taskHtml.join("");
      const inboxLink = document.getElementById("inbox");
      inboxLink.innerHTML = "<span>Inbox</span>";
      const numTasksElement = document.createElement("span");
      numTasksElement.classList.add("num-tasks");
      numTasksElement.innerHTML = incompleteList.length;
      inboxLink.innerHTML =
        "<a class='timed-list' id='inbox-link' href='/'>Inbox</a>";
      inboxLink.appendChild(numTasksElement);
    } catch (e) {
      console.error(e);
    }
    const checkboxes = document.querySelectorAll(".task-check-box");
    completeTasks = {};
    checkboxes.forEach((checkbox) => {
      let id = checkbox.id.slice(3);
      if (completedFlag === false) {
        completeTasks[id] = false;
      } else {
        completeTasks[id] = true;
      }
    });
    console.log(completeTasks);

    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener("click", (event) => {
        let id = event.target.id.slice(3);
        if (checkbox.checked) {
          if (completedFlag === false) {
            completeTasks[id] = true;
          } else {
            completeTasks[id] = false;
          }
        } else {
          if (completedFlag === false) {
            completeTasks[id] = false;
          } else {
            completeTasks[id] = true;
          }
        }

        console.log(completeTasks);
      });
    });

    const tasksClickable = document.querySelectorAll(".filled");
    // const taskNameDetail = document.getElementById("task-name-detail");
    tasksClickable.forEach((taskEle) => {
      taskEle.addEventListener("click", async (event) => {
        const currentList = document.getElementById("current-list");
        taskDueDateSpan.innerHTML = "";
        currentList.innerHTML = "";
        noteList.innerHTML = "";
        //   const taskNameInput = document.getElementById("name-panel-text");
        try {
          const id = taskEle.id.slice(4);
          const res = await fetch(`/api/tasks/${id}`);
          let { task } = await res.json();
          currentTask = task;
          taskNameInput.value = task.name;
          if (task.due) {
            let dateHtml = new Date(task.due).toDateString();
            taskDueDateSpan.innerHTML = dateHtml;
          }

          currentList.innerHTML = task.List.name;
          populateNotes();

          let html = "";
          currentTask.TasksWithTags.forEach((tag) => {
            html += `<span class="no-color-tag-class remove-tag" style="background-color:${tagColors[tag.id % 17]};">${tag.name}<span class="x-button" id="${currentTask.id}tt${tag.id}">  x</span></span>`;
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
        detailPanel.classList.remove("panel-hidden");
        detailPanel.classList.add("panel-shown");
      });
    });
  }

  populateTasks();
  completeButton.addEventListener("click", (event) => {
    console.log(completeTasks);
    markComplete(completeTasks);
  });
  completedTab.addEventListener("click", (event) => {
    completedFlag = true;
    textComplete.innerHTML = "Mark incomplete";
    completeButton.innerHTML = "&#10008";
    populateTasks();
  });
  incompletedTab.addEventListener("click", (event) => {
    completedFlag = false;
    textComplete.innerHTML = "Mark complete";
    completeButton.innerHTML = "&#10003";
    populateTasks();
  });
  const closeButton = document.getElementById("close-button-panel");
  closeButton.addEventListener("click", (event) => {
    detailPanel.classList.remove("panel-shown");
    detailPanel.classList.add("panel-hidden");
  });

  const updateTaskName = async (updatedName, taskId) => {
    const nameToSend = { name: updatedName };
    try {
      const res = await fetch(`/api/tasks/${taskId}/edit`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nameToSend),
      });
      taskNameInput.addEventListener("keypress", keyPressEvent);
      populateTasks();
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
    const value = taskField.value;
    let dueInputValue = dueInput.value;

    if (dueInputValue.length === 0) {
      dueInputValue = null;
    }

    const nameToSend = { name: value, due: dueInputValue };
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nameToSend),
      });
      const completedList = [];
      const incompleteList = [];
      let { tasks } = await res.json();
      tasks.forEach((task) => {
        let tags = task.TasksWithTags;
        if (tags) {
          let html = `<li id="ele-${task.id}" class="filled"><div class="left-border"></div><input class="task-check-box" type="checkbox"><span class="task-text">${task.name}</span>`;
          tags.forEach((tag) => {
            html += `<span class="no-color-tag-class" style="background-color:${tagColors[tag.id % 17]};>${tag.name}</span>`;
          });
        }
        if (task.completed) {
          completedList.push(task);
        } else {
          incompleteList.push(task);
        }
      });
      const taskHtml = [];
      if (!completedFlag) {
        incompleteList.forEach((task) => {
          let tags = task.TasksWithTags;
          let html;
          if (tags) {
            html = `<li id="ele-${task.id}" class="filled"><div class="left-border"></div><input class="task-check-box" id="cb-${task.id}" type="checkbox"><span class="task-text">${task.name}</span>`;
            tags.forEach((tag) => {
              html += `<span class="no-color-tag-class" style="background-color:${tagColors[tag.id % 17]};>${tag.name}</span>`
            });
          }
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
      } else {
        completedList.forEach((task) => {
          let tags = task.TasksWithTags;
          if (tags) {
            html = `<li id="ele-${task.id}" class="filled"><div class="left-border"></div><input class="task-check-box" id="cb-${task.id}" type="checkbox"><span class="task-text complete-task">${task.name}</span>`;
            tags.forEach((tag) => {
              html += `<span class="tag-class">${tag.name}</span>`;
            });
          }
          taskHtml.push(html);
        });
      }
      for (let i = 0; i < 100 - tasks.length; i++) {
        taskHtml.push(`<li><span></span></li>`);
      }
      taskContainer.innerHTML = taskHtml.join("");
      taskField.value = "";
      taskField.blur();
      populateTasks();
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
    dueDateHead.classList.add("shown");
    dueDatePicker.classList.add("shown");
  });
  taskField.addEventListener("blur", (event) => {
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
        let html = `<li id="li-${tag.id}"><div class="left-tag-div"><div class="color-tag" style="background-color:${tagColors[tag.id % 17]};"></div><span>${tag.name}</span></div><button class="tag-button" id="btn-${tag.id}"><span class="tag-button-text">-</span></button></li>`;

        tagHtml.push(html);
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
            event.preventDefault();
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

  const popupAddTagBtn = document.getElementById("addTag");
  const popupAddListBtn = document.getElementById('addList')

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
      console.log('tagId', tagId);
      if (tagId > 0) {
        // add this new tag to the select tagSelector
        const newTagOption = document.createElement('option');
        newTagOption.value = tagId;
        newTagOption.id = `option-${tagId}`;
        newTagOption.text = inputName.value;
        tagSelector.add(newTagOption);
        // console.log(newTagOption);
        inputName.value = "";
        modal.style.display = "none";
      }
    } else if (addFunction === "addList") {
      
    }
  });

  // Get the <span> element that closes the modal
  const span = document.getElementsByClassName("close")[0];

  // When the user clicks the button, open the modal
  addTagBtn.onclick = function () {
    modal.style.display = "block";
    popupAddTagBtn.innerText = "Add Tag";
    inputName.focus();
    addFunction = "addTag";
  };
  addListBtn.onclick = function () {
    modal.style.display = "block";
    popupAddTagBtn.innerText = "Add List";
    inputName.focus();
    addFunction = "addList";
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

  const searchButton = document.getElementById("searchButton");
  const searchText = document.getElementById("searchText");
  function searchAndDisplay(tagName = "") {
    event.preventDefault();
    let textToSearch = searchText.value;
    if (!textToSearch.length) textToSearch = "all";
    populateTasks(`/api/tasks/search/${textToSearch}/${tagName}`);
    searchText.value = "";
  }
  searchButton.addEventListener("click", (event) => {
    searchAndDisplay();
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
        html += `<span class="no-color-tag-class remove-tag" style="background-color:${tagColors[tag.id % 17]};">${tag.name}<span class="x-button" id="${currentTask.id}tt${tag.id}">  x</span></span>`;
      });
      tagsList.innerHTML = html;
      const xTagButtons = document.querySelectorAll(".x-button");
      xTagButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
          removeTag(button);
        });
      });
      populateTasks();
      //   currentTask.notes = await res.json().notes;
    } catch (e) {
      console.error(e);
    }
  }
  async function markComplete(completeTasks) {
    for (let task in completeTasks) {
      const completed = completeTasks[task];
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
    populateTasks();
  }

  // tagSelector.addEventListener('click', event => {
  //   // console.log('click', event);
  // });
  tagSelector.addEventListener("change", async (event) => {
    const tagId = tagSelector.value;
    console.log("change", tagId);
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
        html += `<span class="no-color-tag-class remove-tag" style="background-color:${tagColors[tag.id % 17]};">${tag.name}<span class="x-button" id="${currentTask.id}tt${tag.id}">  x</span></span>`;
      });
      tagsList.innerHTML = html;
      const xTagButtons = document.querySelectorAll(".x-button");
      xTagButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
          removeTag(button);
        });
      });
      populateTasks();
    } catch (e) {}
  });
  sideDueInput.addEventListener('change', async event => {
    const newDueDate = new Date(sideDueInput.value);
    try {
      const res = await fetch(`/api/tasks/${currentTask.id}/edit`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ due: newDueDate }),
      });
      let { task } = await res.json();
      populateTasks();
      const taskDueDate = new Date(task.due);
      const newDate = new Date(taskDueDate.getTime() + Math.abs(taskDueDate.getTimezoneOffset() * 60000)).toDateString();
      let dateHtml = newDate;
      taskDueDateSpan.innerHTML = dateHtml;
      currentTask.due = task.due;
    } catch (e) {
      console.log(e);
    }
  });

  const todayLink = document.getElementById('today');
  const tomorrowLink = document.getElementById('tomorrow');
  const thisWeekLink = document.getElementById('this-week');
  const nextWeekLink = document.getElementById('next-week');

  todayLink.addEventListener('click', event => {
    fetchDateLink(new Date());
  });
  tomorrowLink.addEventListener('click', event => {
    const tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    fetchDateLink(tomorrowDate);
  });
  thisWeekLink.addEventListener('click', event => {
    fetchDateLink(new Date(), true);
  });
  nextWeekLink.addEventListener('click', event => {
    fetchDateLink(new Date(), false, true);
  });  
  function fetchDateLink(date, thisweek = false, nextWeek = false){
    let due = new Date(date.toLocaleDateString()).toISOString().slice(0, 10);
    if(thisweek || nextWeek) {
      let days = 0;
      if(nextWeek) days = 7;
      const sundayOfTheWeek = date;
      sundayOfTheWeek.setDate(date.getDate() + days - date.getDay());
      due = new Date(sundayOfTheWeek.toLocaleDateString()).toISOString().slice(0, 10);
      const saturdayOfTheWeek = date;
      saturdayOfTheWeek.setDate(date.getDate() + 6 + days - date.getDay());
      due += "to" + new Date(saturdayOfTheWeek.toLocaleDateString()).toISOString().slice(0, 10);
    }
    populateTasks(`/api/tasks/search/all`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ due}), 
    });
  }

});

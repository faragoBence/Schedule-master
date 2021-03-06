function showTasks() {
    const taskEl = document.getElementById("tasksUl");
    taskEl.classList.remove('hidden');
    taskButtonEl.removeEventListener('click', showTasks);
    taskButtonEl.addEventListener('click', hideTasks);
}

function hideTasks() {
    const taskEl = document.getElementById("tasksUl");
    taskEl.classList.add('hidden');
    taskButtonEl.removeEventListener('click', hideTasks);
    taskButtonEl.addEventListener('click', showTasks);
}

function updateTask(e) {
    const buttonEl = e.target;
    const liEl = buttonEl.parentElement;
    const spanTask = liEl.firstElementChild;
    const descParEl = spanTask.firstElementChild;

    const oldTitle = spanTask.id;
    const oldDesc = descParEl.textContent;
    const oldColor = rgb2hex(liEl.style.backgroundColor);

    spanTask.remove();
    descParEl.remove();


    const titleInputEl = document.createElement("INPUT");
    titleInputEl.setAttribute("type", "text");
    titleInputEl.setAttribute("class", "input-min");
    titleInputEl.setAttribute("id", "task-title-rename");
    titleInputEl.placeholder = oldTitle;

    const closeTaskButt = document.createElement("button");
    closeTaskButt.addEventListener('click', closeChangeTask);
    closeTaskButt.setAttribute("class", "close-btn-min");

    const breakEl = document.createElement("br");


    const descInputEl = document.createElement("INPUT");
    descInputEl.setAttribute("type", "text");
    descInputEl.placeholder = oldDesc;
    descInputEl.setAttribute("class", "input-min");

    const colorInputEl = document.createElement("INPUT");
    colorInputEl.setAttribute("type", "color");
    colorInputEl.value = oldColor;
    colorInputEl.setAttribute("class", "input-min");

    buttonEl.removeEventListener('click', updateTask);
    buttonEl.addEventListener('click', applyTaskUpdates);

    liEl.removeAttribute("class");
    liEl.setAttribute("class", "task-li-update");


    liEl.insertBefore(breakEl, buttonEl);
    liEl.insertBefore(titleInputEl, buttonEl);
    liEl.insertBefore(descInputEl, buttonEl);
    liEl.insertBefore(colorInputEl, buttonEl);
    liEl.insertBefore(closeTaskButt, buttonEl);
    liEl.insertBefore(breakEl, buttonEl);

}

function applyTaskUpdates(e) {
    const liEl = e.target.parentElement;
    const titleInputField = liEl.firstChild;
    const descInputField = liEl.children.item(1);
    const colorInputField = liEl.children.item(2);

    let scheduleId = null;

    if (daysDiv.firstElementChild !== null) {
        scheduleId = daysDiv.firstElementChild.id;
    }

    let title = titleInputField.value;
    const oldTitle = titleInputField.placeholder;
    let desc = descInputField.value;
    const oldDesc = descInputField.placeholder;
    let color = colorInputField.value;
    const oldColor = colorInputField.value;
    const id = liEl.id;
    const userId = document.getElementById("name-field").getAttribute("name");
    if (title == null || title === "" || title === " ") {
        title = oldTitle;
    }
    if (desc == null || desc === "" || desc === " ") {
        desc = oldDesc;
    }

    if (color == null || color === "" || color === " ") {
        color = oldColor;
    }

    liEl.removeAttribute("class");
    liEl.setAttribute("class", "task-li");

    const data = JSON.stringify({
        id: id,
        description: desc,
        title: title,
        color: color,
        userId: userId,
        scheduleId: scheduleId
    });

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onUpdateTaskResponse);
    xhr.addEventListener('error', onNetworkError);
    xhr.open('PUT', 'protected/task');
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.send(data);
}

function onUpdateTaskResponse() {
    if (this.status === OK) {
        const userDto = JSON.parse(this.responseText);
        document.getElementById("tasksUl").remove();
        createTaskDiv(userDto);
    } else {
        onMessageResponse(mainDiv, this);
    }
}

function showCreateTask() {
    const toCreateTaskButt = document.getElementById("to-createTask-button");
    toCreateTaskButt.removeEventListener('click', showCreateTask);

    const createTaskDiv = document.createElement("div");
    createTaskDiv.setAttribute("id", "create-task");
    createTaskDiv.setAttribute("class", "create-div");

    const closeTaskButt = document.createElement("button");
    closeTaskButt.addEventListener('click', closeCreateTask);
    closeTaskButt.setAttribute("class", "close-btn");

    const inputTitle = document.createElement("INPUT");
    inputTitle.setAttribute("type", "text");
    inputTitle.setAttribute("id", "task-title");
    inputTitle.setAttribute("class", "input-min");
    inputTitle.placeholder = "Title";

    const inputDescript = document.createElement("INPUT");
    inputDescript.setAttribute("type", "text");
    inputDescript.setAttribute("id", "task-desc");
    inputDescript.setAttribute("class", "input-min");
    inputDescript.placeholder = "Description";

    const inputColor = document.createElement("INPUT");
    inputColor.setAttribute("type", "color");
    inputColor.setAttribute("id", "task-color");
    inputColor.setAttribute("class", "input-min");
    inputColor.placeholder = "Color";
    inputColor.value = "#24be3e";

    const breakEl = document.createElement("br");

    const createTaskButt = document.createElement("button");
    createTaskButt.addEventListener('click', createTask);
    createTaskButt.setAttribute('id', 'task-create-btn');
    createTaskButt.setAttribute("class", "create-btn");
    createTaskButt.textContent = "Create";

    createTaskDiv.appendChild(inputTitle);
    createTaskDiv.appendChild(closeTaskButt);
    createTaskDiv.appendChild(inputDescript);
    createTaskDiv.appendChild(breakEl);
    createTaskDiv.appendChild(inputColor);
    createTaskDiv.appendChild(breakEl);
    createTaskDiv.appendChild(createTaskButt);
    taskContentDivEl.appendChild(createTaskDiv);
}

function createTask() {
    const toCreateTaskButt = document.getElementById("to-createTask-button");
    toCreateTaskButt.addEventListener('click', showCreateTask);

    const taskTitleInputEl = document.getElementById("task-title");
    const taskDescInputEl = document.getElementById("task-desc");
    const taskColorInputEl = document.getElementById("task-color");

    const title = taskTitleInputEl.value;
    const description = taskDescInputEl.value;
    const color = taskColorInputEl.value;
    if (title !== "" && description !== "" && color !== "") {
        const params = new URLSearchParams();
        params.append('title', title);
        params.append('description', description);
        params.append('color', color);
        params.append('currentScheduleId', currentScheduleId);

        const xhr = new XMLHttpRequest();
        xhr.addEventListener('load', onCreateTaskResponse);
        xhr.addEventListener('error', onNetworkError);
        xhr.open('POST', 'protected/task');
        xhr.send(params)
    } else {
        newError(mainDiv, "Please fill all the fields");
    }
}

function onCreateTaskResponse() {
    if (this.status === OK) {
        const userDto = JSON.parse(this.responseText);
        document.getElementById("create-task").remove();
        document.getElementById("tasksUl").remove();
        createTaskDiv(userDto);
    } else {
        onMessageResponse(mainDiv, this);
    }
}

function showTaskDescription(e) {
    e.target.firstElementChild.classList.remove("hidden");
    e.target.removeEventListener('click', showTaskDescription);
    e.target.addEventListener('click', hideTaskDescription);
}

function hideTaskDescription(e) {
    e.target.firstElementChild.classList.add("hidden");
    e.target.removeEventListener('click', hideTaskDescription);
    e.target.addEventListener('click', showTaskDescription);
}

function removeTask(e) {
        const liEL = e.target.parentElement;
        const id = liEL.id;
        const userId = document.getElementById("name-field").getAttribute("name");

        let scheduleId = null;

    if (daysDiv.firstElementChild !== null) {
            scheduleId = daysDiv.firstElementChild.id;
        }

    const data = JSON.stringify({"id": id, "userId": userId, "scheduleId": scheduleId});


        const xhr = new XMLHttpRequest();
        xhr.addEventListener('load', onDeleteTaskResponse);
        xhr.addEventListener('error', onNetworkError);
        xhr.open('DELETE', 'protected/task');
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.send(data);
}

function ConfirmRemoveTask(e) {
    const title = e.target.parentElement.firstElementChild.id;
    Confirm('Are you sure to delete this task?', 'The task named ' + title + ' will be deleted.', 'OK', 'Cancel', function () {
        removeTask(e);
    });
}

function onDeleteTaskResponse() {
    if (this.status === OK) {
        const userDto = JSON.parse(this.responseText);
        document.getElementById("tasksUl").remove();
        createTaskDiv(userDto);
    } else {
        onMessageResponse(mainDiv, this);
    }
}

function closeCreateTask() {
    document.getElementById("create-task").remove();
    const toCreateTaskButt = document.getElementById("to-createTask-button");
    toCreateTaskButt.addEventListener('click', showCreateTask);
}

function closeChangeTask() {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onDeleteTaskResponse);
    xhr.addEventListener('error', onNetworkError);
    xhr.open('GET', 'protected/task');
    xhr.send();
}

function rgb2hex(rgb) {
    if (/^#[0-9A-F]{6}$/i.test(rgb)) return rgb;

    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);

    function hex(x) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
    }

    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}


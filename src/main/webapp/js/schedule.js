function showSchedule() {
    const scheduleEl = document.getElementById("schedulesUl");
    scheduleEl.classList.remove('hidden');
    scheduleButtonEl.removeEventListener('click', showSchedule);
    scheduleButtonEl.addEventListener('click', hideSchedule);
}

function hideSchedule() {
    const scheduleEl = document.getElementById("schedulesUl");
    scheduleEl.classList.add('hidden');
    scheduleButtonEl.removeEventListener('click', hideSchedule);
    scheduleButtonEl.addEventListener('click', showSchedule);
}

function showCreateSchedule() {
    const toCreateScheduleButt = document.getElementById("to-createSchedule-button");
    toCreateScheduleButt.removeEventListener('click', showCreateSchedule);

    const createScheduleDiv = document.createElement("div");
    createScheduleDiv.setAttribute("id", "create-schedule");
    createScheduleDiv.setAttribute("class", "create-div");

    const closeScheduleButt = document.createElement("button");
    closeScheduleButt.addEventListener('click', closeCreateSchedule);
    closeScheduleButt.setAttribute("class", "close-btn");

    const inputTitle = document.createElement("INPUT");
    inputTitle.setAttribute("type", "text");
    inputTitle.setAttribute("id", "schedule-title");
    inputTitle.setAttribute("class", "input-min");
    inputTitle.placeholder = "Title";

    const inputDesc = document.createElement("INPUT");
    inputDesc.setAttribute("type", "text");
    inputDesc.setAttribute("id", "schedule-desc");
    inputDesc.setAttribute("class", "input-min");
    inputDesc.placeholder = "Description";

    const numOfDaysSpanEl = document.createElement("span");
    numOfDaysSpanEl.textContent = "Number of days :";

    const inputNumberOfDays = document.createElement("INPUT");
    inputNumberOfDays.setAttribute("type", "number");
    inputNumberOfDays.setAttribute("id", "schedule-days")
    inputNumberOfDays.setAttribute("class", "input-min");
    inputNumberOfDays.placeholder = "Number of Days";
    inputNumberOfDays.max = 7;
    inputNumberOfDays.min = 1;
    inputNumberOfDays.value = 3;

    const breakEl = document.createElement("br");

    const createScheduleButt = document.createElement("button");
    createScheduleButt.addEventListener('click', createSchedule);
    createScheduleButt.setAttribute("id", "schedule-create-btn");
    createScheduleButt.setAttribute("class", "create-btn");
    createScheduleButt.textContent = "Create";

    createScheduleDiv.appendChild(inputTitle);
    createScheduleDiv.appendChild(closeScheduleButt);
    createScheduleDiv.appendChild(inputDesc);
    createScheduleDiv.appendChild(breakEl);
    createScheduleDiv.appendChild(numOfDaysSpanEl);
    createScheduleDiv.appendChild(inputNumberOfDays);
    createScheduleDiv.appendChild(breakEl);
    createScheduleDiv.appendChild(createScheduleButt);
    scheduleContentDivEl.appendChild(createScheduleDiv);
}

function createSchedule() {
    const toCreateScheduleButt = document.getElementById("to-createSchedule-button");
    toCreateScheduleButt.addEventListener('click', showCreateSchedule);

    const scheduleTitleInputEl = document.getElementById("schedule-title");
    const scheduleDescInputEl = document.getElementById("schedule-desc");
    const scheduleNumberOfDays = document.getElementById("schedule-days");

    const title = scheduleTitleInputEl.value;
    const description = scheduleDescInputEl.value;
    const days = scheduleNumberOfDays.value;

    if (title !== "" && description !== "") {
        const params = new URLSearchParams();
        params.append('title', title);
        params.append('description', description);
        params.append('days', days);

        const xhr = new XMLHttpRequest();
        xhr.addEventListener('load', onCreateScheduleResponse);
        xhr.addEventListener('error', onNetworkError);
        xhr.open('POST', 'protected/schedule');
        xhr.send(params)
    } else {
        newError(mainDiv, "Please fill all the fields");
    }
}

function onCreateScheduleResponse() {
    if (this.status === OK) {
        const userDto = JSON.parse(this.responseText);
        document.getElementById("create-schedule").remove();
        document.getElementById("schedulesUl").remove();
        createScheduleDiv(userDto);
    } else {
        onMessageResponse(mainDiv, this);
    }
}

function removeSchedule(e) {
    var r = confirm("Press a button!\nEither OK or Cancel.");
    if (r == true) {

        const liEL = e.target.parentElement;
        const id = liEL.id;
        removeAllChildren(daysDiv);
        const title = liEL.children.item(1).textContent;
        const desc = liEL.children.item(1).id;
        const userId = document.getElementById("name-field").name;

        const data = JSON.stringify({"id": id,"userId" :userId,"title": title, "description": desc});


        const xhr = new XMLHttpRequest();
        xhr.addEventListener('load', onDeleteScheduleResponse);
        xhr.addEventListener('error', onNetworkError);
        xhr.open('DELETE', 'protected/schedule');
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.send(data);
    }

}

function onDeleteScheduleResponse() {
    if (this.status === OK) {
        const userDto = JSON.parse(this.responseText);
        document.getElementById("schedulesUl").remove();
        createScheduleDiv(userDto);
    } else {
        onMessageResponse(mainDiv, this);
    }
}

function listingSchedules(e) {
    const btnList = document.getElementsByClassName("show-schedule-span");
    for (let i = 0; i < btnList.length; i++) {
        btnList[i].removeEventListener('click', hideListingSchedules);
        btnList[i].addEventListener('click', listingSchedules);
    }
    e.target.removeEventListener('click', listingSchedules);
    e.target.addEventListener('click', hideListingSchedules);
    const idSchedule = e.target.parentElement.id;
    const xhr = new XMLHttpRequest();

    const params = new URLSearchParams();
    params.append("scheduleId", idSchedule);

    xhr.addEventListener('load', onListingResponse);
    xhr.addEventListener('error', onNetworkError);
    xhr.open('GET', 'protected/schedule?' + params.toString());
    xhr.send();
}

function onListingResponse() {
    if (this.status === OK) {
        const userDto = JSON.parse(this.responseText);
        removeAllChildren(daysDiv);
        listingDays(userDto);
    } else {
        onMessageResponse(mainDiv, this);
    }
}

function listingDays(userDto) {
    clearMessages();
    const table = document.createElement("table");
    table.setAttribute("class", "schedule-table");
    table.setAttribute("id", userDto.schedule.id);

    const updateButt = document.createElement("button");
    updateButt.addEventListener('click', updateScheduleFields);
    updateButt.setAttribute("class", "change-btn");

    const createTd = document.createElement("td");
    createTd.setAttribute("class", "change-sched-fields");
    createTd.rowSpan = "2";
    createTd.appendChild(updateButt);


    const titleRow = document.createElement("tr");
    titleRow.setAttribute("id", userDto.schedule.id);
    titleRow.setAttribute("class", "name-row");


    const descriptionRow = document.createElement("tr");
    descriptionRow.setAttribute("class", "desc-row");

    let numberOfDays = userDto.schedule.days.length;

    if (numberOfDays > 1) {
        numberOfDays -= 1;
    }


    const titleTd = document.createElement("td");
    titleTd.colSpan = numberOfDays;

    const descriptionTd = document.createElement("td");
    descriptionTd.colSpan = numberOfDays;

    titleTd.textContent = userDto.schedule.title;
    descriptionTd.textContent = userDto.schedule.description;

    titleRow.appendChild(titleTd);
    titleRow.appendChild(createTd);
    descriptionRow.appendChild(descriptionTd);

    table.appendChild(titleRow);
    table.appendChild(descriptionRow);

    let tr = document.createElement("tr");
    tr.setAttribute("class", "day-row");
    tr.setAttribute('id', userDto.schedule.id);

    for (let i = 0; i < userDto.schedule.days.length; i++) {

        let td = document.createElement("td");
        td.setAttribute("class", "day-td");
        let hoursTable = document.createElement("table");
        hoursTable.setAttribute("class", "hours-table");

        let titleParEl = document.createElement("p");
        titleParEl.textContent = userDto.schedule.days[i].title;
        titleParEl.setAttribute("id", userDto.schedule.days[i].id);
        titleParEl.setAttribute("class", "title-par");
        td.appendChild(titleParEl);

        let renameButt = document.createElement("button");
        renameButt.setAttribute("id", userDto.schedule.days[i].title);
        renameButt.setAttribute("class", "change-btn-min");
        renameButt.addEventListener('click', renameDay);
        td.appendChild(renameButt);


        for (let j = 0; j < userDto.schedule.days[i].hours.length; j++) {
            let hoursTr = document.createElement("tr");
            hoursTr.setAttribute("id", userDto.schedule.days[i].hours[j].id);
            hoursTr.setAttribute("class", "hours-row");

            let hoursTd = document.createElement("td");
            hoursTd.setAttribute("class", "hours-td");
            hoursTd.textContent = userDto.schedule.days[i].hours[j].value + ":00hr";

            if (userDto.schedule.days[i].hours[j].task != null) {

                hoursTd.textContent = "";

                let task = userDto.schedule.days[i].hours[j].task;
                let taskDivEl = document.createElement("div");

                taskDivEl.style.backgroundColor = task.color;
                taskDivEl.setAttribute("id", task.id);
                taskDivEl.setAttribute("class", "task-div-little-div");

                let taskSpan = document.createElement("span");
                taskSpan.textContent = task.title;
                taskSpan.setAttribute('class', 'task-title-span');

                taskDivEl.appendChild(taskSpan);
                hoursTd.appendChild(taskDivEl);
            }
            hoursTd.addEventListener('drop', drag_drop);
            hoursTd.addEventListener('dragenter', drag_enter);
            hoursTd.addEventListener('dragover', drag_over);
            hoursTr.appendChild(hoursTd);
            hoursTable.appendChild(hoursTr);

        }
        td.appendChild(hoursTable);
        tr.appendChild(td);
    }
    table.appendChild(tr);
    daysDiv.appendChild(table);

    const guestButton = document.createElement("button");
    guestButton.setAttribute("class", "btn");
    guestButton.innerText = "Create Guest Link";

    guestButton.addEventListener('click', createLink);

    daysDiv.appendChild(guestButton);
}

function createLink(e) {
    e.target.removeEventListener('click', createLink);
    const linkInputField = document.createElement("INPUT");
    linkInputField.setAttribute("id", "guest-link");
    linkInputField.setAttribute("class", "input");
    linkInputField.setAttribute("type", "text");

    const scheduleId = e.target.parentElement.firstElementChild.id;

    const params = new URLSearchParams();
    params.append('scheduleId', scheduleId);

    linkInputField.value = "localhost:8080/schedule-master/guest?" + params.toString();
    daysDiv.appendChild(linkInputField);

}

function hideListingSchedules(e) {
    e.target.removeEventListener('click', hideListingSchedules);
    e.target.addEventListener('click', listingSchedules);
    removeAllChildren(daysDiv);
}

function renameDay(e) {
    const buttonEl = e.target;
    const tdEl = buttonEl.parentElement;

    const titleEl = tdEl.firstChild;
    const oldTitle = buttonEl.id;


    const id = titleEl.id;
    titleEl.remove();

    const newTitle = document.createElement("INPUT");
    newTitle.setAttribute("type", "text");
    newTitle.placeholder = oldTitle;
    newTitle.setAttribute("id", id);
    newTitle.setAttribute("class", "input-miniature");

    buttonEl.removeEventListener('click', renameDay);
    buttonEl.addEventListener('click', applyDayUpdates);

    tdEl.insertBefore(newTitle, buttonEl);
    tdEl.insertBefore(document.createElement("br"), buttonEl);

}

function applyDayUpdates(e) {
    const tdEl = e.target.parentElement;
    const titleInputField = tdEl.firstChild;
    const scheduleTitleField = tdEl.parentElement.parentElement.firstChild;

    let title = titleInputField.value;
    const oldTitle = titleInputField.placeholder;
    const id = titleInputField.id;
    const scheduleId = scheduleTitleField.id;

    if (title === "" || title === " ") {
        title = oldTitle;
    }

    const data = JSON.stringify({"id": id, "title": title, "scheduleId": scheduleId});
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onUpdateDayResponse);
    xhr.addEventListener('error', onNetworkError);
    xhr.open('PUT', 'protected/day');
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(data);
}

function onUpdateDayResponse() {
    if (this.status === OK) {
        const userDto = JSON.parse(this.responseText);
        removeAllChildren(daysDiv);
        listingDays(userDto);
    }
    else {
        onMessageResponse(mainDiv, this);
    }
}

function closeCreateSchedule() {
    document.getElementById("create-schedule").remove();
    const toCreateTaskButt = document.getElementById("to-createSchedule-button");
    toCreateTaskButt.addEventListener('click', showCreateSchedule);
}

function updateScheduleFields(e) {
    const scheduleUpdateButt = e.target;
    const trEl = scheduleUpdateButt.parentElement.parentElement;
    const table = trEl.parentElement;

    const titleEl = trEl.firstChild;
    const descEl = table.children.item(1).firstChild;

    const oldTitle = titleEl.textContent;
    const oldDesc = descEl.textContent;
    const colspan = titleEl.colSpan;

    titleEl.remove();
    descEl.remove();

    const titleTd = document.createElement("td");
    titleTd.colSpan = colspan;
    const descTd = document.createElement("td");
    descTd.setAttribute("class", "desc-td");
    descTd.colSpan = colspan;

    const titleInputEl = document.createElement("INPUT");
    titleInputEl.setAttribute("type", "text");
    titleInputEl.setAttribute("class", "input-min");
    titleInputEl.placeholder = oldTitle;
    titleTd.appendChild(titleInputEl);

    const descInputEl = document.createElement("INPUT");
    descInputEl.setAttribute("type", "text");
    descInputEl.placeholder = oldDesc;
    descInputEl.setAttribute("class", "input-min");
    descTd.appendChild(descInputEl);


    scheduleUpdateButt.removeEventListener('click', updateScheduleFields);
    scheduleUpdateButt.addEventListener('click', applyScheduleUpdates);

    trEl.insertBefore(titleTd, scheduleUpdateButt.parentElement);
    table.children.item(1).appendChild(descTd);


}

function applyScheduleUpdates(e) {
    const scheduleUpdateButt = e.target;
    const trEl = scheduleUpdateButt.parentElement.parentElement;
    const table = trEl.parentElement;

    const titleInputEl = trEl.firstChild.firstChild;
    const descInputEl = table.children.item(1).firstChild.firstChild;

    const id = table.id;

    const userId = document.getElementById("name-field").name;

    let title = titleInputEl.value;
    const oldTitle = titleInputEl.placeholder;

    let desc = descInputEl.value;
    const oldDesc = descInputEl.placeholder;

    if (title == null || title === "" || title === " ") {
        title = oldTitle;
    }
    if (desc == null || desc === "" || desc === " ") {
        desc = oldDesc;
    }

    const data = JSON.stringify({"scheduleId": id, "description": desc, "title": title, "userId": userId});

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onUpdateScheduleResponse);
    xhr.addEventListener('error', onNetworkError);
    xhr.open('PUT', 'protected/schedule');
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(data);
}

function onUpdateScheduleResponse() {
    if (this.status === OK) {
        const userDto = JSON.parse(this.responseText);
        removeAllChildren(daysDiv);
        document.getElementById("schedulesUl").remove();
        createScheduleDiv(userDto);
        listingDays(userDto);
    } else {
        onMessageResponse(mainDiv, this);
    }

}

function drag_drop(ev) {
    ev.preventDefault();

    const taskId = ev.dataTransfer.getData("text");
    const hourId = ev.target.parentElement.id;
    const scheduleId = ev.target.parentElement.parentElement.parentElement.parentElement.id;

    const params = new URLSearchParams();
    params.append('taskId', taskId);
    params.append('hourId', hourId);
    params.append('scheduleId', scheduleId);

    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', onDragResponse);
    xhr.addEventListener('error', onNetworkError);
    xhr.open('POST', 'protected/taskHour');
    xhr.send(params);
}

function onDragResponse() {
    if (this.status === OK) {
        const userDto = JSON.parse(this.responseText);
        removeAllChildren(daysDiv);
        document.getElementById("tasksUl").remove();
        createTaskDiv(userDto);
        listingDays(userDto);
    } else {
        onMessageResponse(mainDiv, this);
    }
}

function drag_enter(event) {
    event.preventDefault();
}

function drag_over(event) {
    event.preventDefault();
}
$.ajax({
    type: 'POST',
    contentType: "application/json",
    success: onsuccess,
    error: onerror
})

var groupName;
var groupHash;
var eventList;

function onsuccess(data) {
    if (data.respondCode == 1) {
        groupName = data.groupName
        groupHash = data.groupHash
        eventList = data.eventList
        displayTimetableAndStuff()
    }
    else {
        alert(data.message)
        badCookies()
    }
}
function onerror() {
    alert('failed to connect to server...')
    window.location.href = "/"
}

function displayTimetableAndStuff() { // display the timetable union of the group
    document.getElementById("gpname").innerHTML = groupName
    document.getElementById("gplink").innerHTML = window.location.host + '/join/?hash=' + groupHash
    for (i = 0; i < eventList.length; i++) {
        $(`#${eventList[i].day}`).append(`<li class="cd-schedule__event"><a data-start="${eventList[i].start}" data-end="${eventList[i].end}" data-event="event-3"><em class="cd-schedule__name"></em></a></li>`);
    }
    renderTimetable() // call the 3rd party render timetable function
}

$('#leave').click(() => {
    window.location.href = "/leave/" + window.location.search
})
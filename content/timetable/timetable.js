// send cookies to server first
$.ajax({
    type: 'POST',
    contentType: "application/json",
    url: '/timetable',
    success: onsuccess,
    error: onerror
})

var events

function onsuccess(data) {
    if (data.respondCode == 1) {
        events = data.events
        displayTimetable()
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

function displayTimetable() {
    for (i = 0; i < events.length; i++) {
        $(`#${events[i].day}`).append(`<li class="cd-schedule__event"><a data-start="${events[i].start}" data-end="${events[i].end}" data-event="event-1"><em class="cd-schedule__name">${events[i].eventName}</em></a></li>`);
    }
    renderTimetable()
}
// send cookies to server first
$.ajax({
    type: 'POST',
    contentType: "application/json",
    url: '/edit_timetable',
    success: onsuccess,
    error: onerror
})

var events

function onsuccess(data) {
    if (data.respondCode == 1) {
        events = data.events
        displayEventList()
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

function displayEventList() {

    for (i = 0; i < events.length; i++) {
        
    var Tr = document.createElement("tr");

        var nameC = document.createElement('td');
        var ename = document.createTextNode(events[i].eventName);
        nameC.appendChild(ename);
        
        var startC = document.createElement('td');
        var start = document.createTextNode(events[i].start);
        startC.appendChild(start);
        
        var endC = document.createElement('td');
        var end = document.createTextNode(events[i].end);
        endC.appendChild(end);
        
        var deleteC = document.createElement('td');
        var deleteBtn = document.createElement('btn');
        deleteBtn.type = "button";
        deleteBtn.style = "border-radius: 5px;";
        deleteBtn.className = "btn-block btn-danger p-1";
        var del = document.createTextNode("delete");
        deleteBtn.appendChild(del);
        deleteC.appendChild(deleteBtn);


        Tr.appendChild(nameC);
        Tr.appendChild(startC);
        Tr.appendChild(endC);
        Tr.appendChild(deleteC);

        document.getElementById(events[i].day).appendChild(Tr);
    }
}
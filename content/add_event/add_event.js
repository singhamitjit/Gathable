$('#add').click(() => {

    var ename = $('#event').val()
    var day = $('#day').children("option:selected").val()
    var start = $('#startTime').val()
    var end = $('#endTime').val()

    if (ename == '' || day == "Choose the day" || start == '' || end == '') {
        return
    }
    if (end <= start) {
        alert("Tips: time goes forward")
        return
    }

    var message = {
        ename: ename,
        start: start,
        end: end,
        day: day
    }
    $.ajax({
        type: 'POST',
        contentType: "application/json",
        url: '/add_event',
        data: JSON.stringify(message),
        success: onsuccess,
        error: onerror
    })

    function onsuccess(data) {
        if (data.respondCode != 1) {
            alert(data.message)
        }
        else {
            window.location.href = "/edit_timetable/"
        }
    }

    function onerror() {
        alert('failed to connect to server...')
    }
})
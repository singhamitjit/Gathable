/*html imports:
    - Ajax
    - jsSHA
    - "function/account.js"
*/
$('#confirm').click(() => {

    var groupName = $('#event').val()
    var description = $('#description').val()

    // if there exists an empty field, ignore the click
    if (groupName == "") {
        alert("Error: group name should not be empty")
        return
    }
    if (groupName.length > 20) {
        alert("Error: group name should not be longer than 20 characters")
        return
    }
    if (description.length > 100) {
        alert("Error: group description should not be longer than 100 characters")
        return
    }

    var message = {
        groupName: groupName,
        description: description
    }

    $.ajax({
        type: 'POST',
        contentType: "application/json",
        url: '/create_group/',
        data: JSON.stringify(message),
        success: onsuccess,
        error: onerror
    })
})

function onsuccess(data) {
    if (data.respondCode != 1) { // not successful because of invalid data or username registered already
        alert(data.message)
    }
    else {
        alert("Group created successfully.")
        window.location.href = "/home/"
    }
}

function onerror() {
    alert('failed to connect to server...')
}
// send cookies to server first
$.ajax({
	type: 'POST',
	contentType: "application/json",
	url: '/home',
	success: onsuccess,
	error: onerror
})

var groupList, yourname;

function onsuccess(data) {
	if (data.respondCode == 1) {
		yourname = data.username
		groupList = data.groupList
		displayGroupList()
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

function displayGroupList() {
	document.getElementById("name").innerHTML = yourname;
	for (i = 0; i < groupList.length; i++) {
		var Div = document.createElement("div");
		Div.className = "list-group-item w-100 justify-content-between";

		var h5 = document.createElement('h5');
		var gname = document.createTextNode(groupList[i].gname);

		h5.appendChild(gname);

		var member = document.createElement('span');
		member.className = "badge bg-primary rounded-pill";
		member.style.float = "right";
		var memberNo;
		if (groupList[i].gcount > 1) { memberNo = document.createTextNode(groupList[i].gcount + " members") }
		else { memberNo = document.createTextNode(groupList[i].gcount + " member") }

		member.appendChild(memberNo);
		h5.appendChild(member);
		Div.appendChild(h5);

		var descript = document.createElement('small');
		descript.className = "text-muted";
		var descriptContent = document.createTextNode(groupList[i].gnotice);

		descript.appendChild(descriptContent);
		Div.appendChild(descript);

		document.getElementById("grouplist").appendChild(Div);
	}
}
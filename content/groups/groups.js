// send cookies to server first
$.ajax({
	type: 'POST',
	contentType: "application/json",
	url: '/home',
	success: onsuccess,
	error: onerror
})

var groupList;

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
	for (i = 0; i < groupList.length; i++) {
		var Div = document.createElement("div");
		Div.className = "w-100 justify-content-between";

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

		var p1 = document.createElement('p');
		var creator = document.createTextNode("Creator: " + groupList[i].gmanager);

		p1.appendChild(creator);
		Div.appendChild(p1);

		var descript = document.createElement('small');
		descript.className = "text-muted";
		var descriptContent = document.createTextNode(groupList[i].gnotice);

		descript.appendChild(descriptContent);
		Div.appendChild(descript);

		var bt = document.createElement('button');
		bt.className = "list-group-item list-group-item-action groupButton";
		bt.setAttribute("group_id", groupList[i].gid)
		bt.setAttribute("onclick", `window.location.href='/group_tb/?uid=${groupList[i].gid}'`)
		bt.appendChild(Div);

		document.getElementById("grouplist").appendChild(bt);
	}
	uiReady()
}
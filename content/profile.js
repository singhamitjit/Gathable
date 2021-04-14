var name = "name from node.js";
var userid = "userid from node.js";

document.getElementById("name").innerHTML = name;

document.getElementById("uid").innerHTML = userid;


// get information for database

/* standard groupinfo objeect {groupName: , creator: , members: , description: , gplink:}   
 */


// var groupinfos = [] 


//below is sample test

//2 groups
var groupinfos2 = [{groupName: "first", creator:"jesus" , members:40 , description: "dsaf asfd sadf noijpjpsdpf sa fsadfpjpsak pfdp",gplink: ""},{groupName: "firsdft", creator:"jefus" , members:30 , description: "lol saf asfd sadf noijpjpsdpf sa fsadfpjpsak pfdp", gplink:""}] 

//5 groups
var groupinfos5 = [{groupName: "first", creator:"jesus" , members:40 , description: "dsaf asfd sadf noijpjpsdpf sa fsadfpjpsak pfdp", gplink:""},{groupName: "firsdft", creator:"jefus" , members:30 , description: "lol saf asfd sadf noijpjpsdpf sa fsadfpjpsak pfdp", gplink:""}, {groupName: "fiqqrst", creator:"jqesus" , members:42 , description: "qqdsaf asfd sadf noijpjpsdpf sa fsadfpjpsak pfdp", gplink:""},{groupName: "firsdft", creator:"ffjefus" , members:320 , description: "ffflol saf asfd sadf noijpjpsdpf sa fsadfpjpsak pfdp", gplink:""},{groupName: "first", creator:"jesus" , members:40 , description: "dsaf asfd sadf noijpjpsdpf sa fsadfpjpsak pfdp", gplink:""},{groupName: "firvsdft", creator:"jefdgfhus" , members:30 , description: "lofdhgl saf asfd sadf noijpjpsdpf sa fsadfpjpsak pfdp" , gplink: "" } ]



var groupinfos = groupinfos5

for (i = 0; i < groupinfos.length; i++) {
	var Div = document.createElement("div");
	Div.className = "listitem";

	var h2 = document.createElement('h2');
	var gname = document.createTextNode(groupinfos[i].groupName);

	h2.appendChild(gname);
	Div.appendChild(h2);

	var p1 = document.createElement('p');
	var infoline = document.createTextNode("Creator: " + groupinfos[i].creator + "\u00A0\u00A0 Members: " + groupinfos[i].members);

	p1.appendChild(infoline);
	Div.appendChild(p1) ;

	var p2 = document.createElement('p');
	var b = document.createElement('br');
	var d1 = document.createTextNode("Description:");
	var d2 = document.createTextNode(groupinfos[i].description);

	p2.appendChild(d1);
	p2.appendChild(b);
	p2.appendChild(d2);
	Div.appendChild(p2) ;

	var bt = document.createElement('a');
	bt.className = "fakebutton";
	bt.setAttribute( "href", groupinfos[i].gplink)
	var btinfo = document.createTextNode("Enter");
	bt.appendChild(btinfo);
	Div.appendChild(bt);

	document.getElementById("hidelist").appendChild(Div);
}



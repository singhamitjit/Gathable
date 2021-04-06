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
	Div.className = "w-100 justify-content-between";

	var h5 = document.createElement('h5');
	var gname = document.createTextNode(groupinfos[i].groupName);

	h5.appendChild(gname);

    var member = document.createElement('span');
    member.className = "badge bg-primary rounded-pill";
	member.style.float = "right";
    var memberNo;
    if (groupinfos[i].members > 1) {memberNo = document.createTextNode(groupinfos[i].members + " members")}
    else {memberNo = document.createTextNode(groupinfos[i].members + " member")}

    
    
    member.appendChild(memberNo);
	h5.appendChild(member);
	Div.appendChild(h5);

    var p1 = document.createElement('p');
	var creator = document.createTextNode("Creator: " + groupinfos[i].creator);

	p1.appendChild(creator);
	Div.appendChild(p1) ;

	var descript = document.createElement('small');
    descript.className = "text-muted";
	var descriptContent = document.createTextNode(groupinfos[i].description);

	descript.appendChild(descriptContent);
	Div.appendChild(descript);

    var bt = document.createElement('a');
	bt.className = "list-group-item list-group-item-action";
	bt.setAttribute( "href", "./home.html")

    bt.appendChild(Div);

	document.getElementById("grouplist").appendChild(bt);
}
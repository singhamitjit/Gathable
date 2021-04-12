// get information for database

/* standard groupinfo objeect {groupName: , creator: , members: , description: , gplink:}   
 */


// var groupinfos = [] 


//below is sample test

//event list
var events = [{day: "Sunday", eventName: "Hello", start: "13:33", end: "15:11"}, 
              {day: "Monday", eventName: "World", start: "13:12", end: "14:11"}, 
              {day: "Tuesday", eventName: "I", start: "09:33", end: "15:01"},
              {day: "Wednesday", eventName: "Am", start: "13:11", end: "19:11"}, 
              {day: "Thursday", eventName: "Your", start: "13:19", end: "16:11"}, 
              {day: "Friday", eventName: "Father", start: "11:33", end: "17:11"},
              {day: "Saturday", eventName: "Noooooooooooo", start: "13:39", end: "15:31"},
              {day: "Saturday", eventName: "!!!!!!!!!!!!!", start: "17:39", end: "19:31"}
             ] 

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

    Tr.appendChild(nameC);
    Tr.appendChild(startC);
    Tr.appendChild(endC);

	document.getElementById(events[i].day).appendChild(Tr);
}
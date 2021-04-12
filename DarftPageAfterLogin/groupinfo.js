let gpName = "GOD MAXIMUM"
document.getElementById("gpname").innerHTML = gpName;


// get information for database

//below is sample test

//event list

//testing data, not real data, structure may different
var events = [
              {day: "Sunday", eventName: "Hello", start: "13:33", end: "15:11", who: "Ada"}, 
              {day: "Monday", eventName: "World", start: "13:12", end: "14:11", who: "Bob"}, 
              {day: "Tuesday", eventName: "I", start: "09:33", end: "15:01", who: "Cody"},
              {day: "Wednesday", eventName: "Am", start: "13:11", end: "19:11", who: "Eden"}, 
              {day: "Thursday", eventName: "Your", start: "13:19", end: "16:11", who: "Fred"}, 
              {day: "Friday", eventName: "Father", start: "11:33", end: "17:11", who: "Gigi"},
              {day: "Saturday", eventName: "Noooooooooooo", start: "13:39", end: "15:31", who: "Helen"},
              {day: "Saturday", eventName: "!!!!!!!!!!!!!", start: "17:39", end: "19:31", who: "Ivan"}
             ] 

function loadTB(){
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
        var whoC = document.createElement('td');
        var who = document.createTextNode(events[i].who);
        whoC.appendChild(who);
    
        Tr.appendChild(nameC);
        Tr.appendChild(startC);
        Tr.appendChild(endC);
        Tr.appendChild(whoC);
    
        document.getElementById(events[i].day).appendChild(Tr);
    } 
}

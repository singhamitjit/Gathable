var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "yourusername",
  password: "yourpassword"
});

// con.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected!");
//   con.query("CREATE DATABASE mydb", function (err, result) {
//     if (err) throw err;
//     console.log("Database created");
//   });
// });

function GetSharedTimetable(groupID) {
  con.connect(function(err) {
    if (err) throw err
    con.query("SELECT * FROM event_data JOIN group_data ON group_id = event_id WHERE group_id = " + groupID,
      function (err, result, fields) {
        if (err) throw err
        console.log(result)
      })
  })
}
function GetTimetableUnion(groupID) {
  con.connect(function(err) {
    if (err) throw err
  })
}
function GetAllEventsInGroup() {

}
function SendTimeTableToGroup() {

}
function CreateGroup(groupManager, groupName, groupNotice) {
  con.connect(function(err) {
    if (err) throw err

    con.query("INSERT INTO group_data (manager, gname, gnotice) VALUES (" + groupManager + ", " + groupName + ", " + groupNotice + ")",
      function(err, result) {
        if (err) throw err
        console.log("group created")
      })
  })
}
function AddUserIdToGroup(userID, groupID) {
  con.connect(function(err) {
    if (err) throw err
    con.query("INSERT INTO group_relation (gid, uid) VALUES (" + groupID + ", " + userID + ")",
      function(err, result) {
        if (err) throw err
        console.log("added 1 user to group")
      })
  })
}
function DeleteGroup(groupID) {
  con.connect(function(err) {
    if (err) throw err
    con.query("DELETE FROM group_data WHERE gid = " + groupID, function(err, result) {
      if (err) throw err
      console.log("deleted group")
    })
  })
}
function EditGroupInfo() {
    
}
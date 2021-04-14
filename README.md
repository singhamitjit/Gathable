# Gathable

A timetable and scheduling web application


# directory structure

Gathable/: the project folder  
├── content/: any file under content will be sent to clients  
│   ├── asset/: basically everything (e.g. images, icons) other than codes  
│   ├── function/: JavaScript files that contains functions which will be shared by different pages  
│   ├── landing/: the landing page  
│   ├── login/: the login page  
│   └── register/: the register page  
├── server.js: entry point of the server, contains client <--> server functions  
├── databaseFunc.js: server <--> database functions  
└── serverUtil.js: server functions  

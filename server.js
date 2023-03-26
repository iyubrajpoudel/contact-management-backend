// Requiring http module
const http = require('http');

// Importing app from app.js
const app = require("./app");
    
// Creating Server and hosting express app on it
const server = http.createServer(app);

// Listening to server (port)

// server.listen(PORT_NO, CALLBACK_FUNCTION)
server.listen(3000, () => {
    console.log("Listening to port 3000.");
});

// server.listen(3000, function(){
//     console.log("Listening to port 3000");
// });

// server.listen(3000, console.log("Listening to port 3000"));wdfeb
require('dotenv').config();

const http = require('http');
const app = require('./src/app');
const ConnectToDB = require('./src/db/db');
const initSocketServer = require('./src/sockets/socket.server');

ConnectToDB();

// Create HTTP server from Express app
const httpServer = http.createServer(app);

// Initialize Socket.IO
initSocketServer(httpServer);

// Start server
httpServer.listen(3000, () => {
    console.log('Server is running on port 3000');
});
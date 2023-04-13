const http = require("http");
const PORT = process.env.PORT || 3000;
const app = require("./app");

http.createServer(app).listen(PORT,()=>{console.log(`Server is running on ${PORT}`)});
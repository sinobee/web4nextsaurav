const express = require("express");
const app = express();
const test = require("./Route/test");
const cognitoRoute = require("./Route/cognitoRoute");
const connection = require("./model/testModel");
const studentApiMiddleware = require("./middleware/studentApiMiddleware");
app.use(express.json(
{
    limit:"20mb",

}))
app.use("/auth",cognitoRoute);
app.use("/test",test);

app.use((req,res,next)=>{
let error = new Error("Not found");
error.status = 404;
next(error);
})

app.use((err,req,res,next)=>{
    res.json({
        Message :err.message,
        statusCode :err
    })
})
module.exports = app;






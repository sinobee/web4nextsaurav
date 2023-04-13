const express = require("express");
const cognitoController = require("../Controller/cognitoController");
const route = express.Router();


route.post("/signup",cognitoController.signup);
route.post("/login",cognitoController.login);
route.post("/verify",cognitoController.verify);


module.exports=route;
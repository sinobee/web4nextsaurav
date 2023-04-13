const express = require("express");
const testController = require("../Controller/testController");
const route = express.Router();
const connection = require("../model/testModel")
const studentApiMiddleware = require("../middleware/studentApiMiddleware");
connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
   
    console.log('connected as id ' + connection.threadId);
  });

route.use(studentApiMiddleware);
route.get("/info/user",testController.getUser);
route.get("/",testController.getAllStudentRecord);
route.post("/",testController.postSingleRecord);
route.get("/:rollno",testController.getSingleStudentRecord);
route.delete("/:rollno",testController.deleteStudent);
route.put("/:rollno",testController.updateStudnt);


module.exports= route;
const connection = require("../model/testModel");
function getAllStudentRecord(req,res){
   try{
      connection.query('SELECT *FROM STUDENT', function (error, results, fields) {
        if (error){
            console.log(error);
        }
        res.status(200).json({
            total_result : fields.length,
            data : results,
        })
      });
   }catch(err){
    console.log(`${err}`);
    return res.status(501).json({
         err:err
    })
   }
}
function postSingleRecord(req,res){
    const rollno = req.body.rollno;
    const name = req.body.name;
    const clas = req.body.clas;
    const section  = req.body.section;
    const gen = req.body.gen;
     console.log(name,clas,rollno,section,gen)
    if(rollno=="" || name=="" || clas=="" || section=="" || gen==""){
        return res.status(409).json({
            message:"ALl field is required"
        })
    }


    try{
        const sql = `INSERT INTO student (rollno, name, class, section, gender) VALUES ('${rollno}', '${name}', '${clas}', '${section}', '${gen}')`;
        connection.query(sql,(err,results,fields)=>{
            if(err){
                connection.end();
                return res.status(500).json({
                    error : err
                })
            }

            res.status(200).json({
                data :results,
                fields:fields
            })
        })
    }catch(err){
        return res.status(500).json({
            message:err
        })
    }
}
function getSingleStudentRecord(req,res){
    try{
           const rollno = req.params.rollno;
          connection.query(`SELECT * FROM STUDENT WHERE rollno='${rollno}'`, function (error, results, fields) {
            if (error){
                console.log(error);
            }
            console.log(fields);
            if(results.length<=0){
                return res.status(400).json({
                    Message:"Something wrong with your roll number"
                })
                
            }else{
                return  res.status(200).json({
                    data : results,
                })
            }
          });
       }catch(err){
        console.log(`${err}`);
        return res.status(501).json({
             err:err
        })
       }
}
function deleteStudent(req,res){

    try{
           const rollno = req.params.rollno;
          connection.query(`DELETE FROM STUDENT WHERE rollno='${rollno}'`, function (error, results, fields) {
            if (error){
                console.log(error);
            }
                
            if(results.affectedRows==0){
                return res.status(200).json({
                    Message:"Something wrong with your roll number"
                })
            }else{
                return res.status(200).json({
                    Message:`${rollno} Deleted Successfully`
                })
            }
         
          });
       }catch(err){
        console.log(`${err}`);
        return res.status(501).json({
             err:err
        })
       }
}
function updateStudnt(req,res){
    const name = req.body.name;
    const clas = req.body.clas;
    const section  = req.body.section;
    const gen = req.body.gen;
    try{
        const rollno = req.params.rollno;
       connection.query(`UPDATE student SET name='${name}',class='${clas}',section='${section}',gender='${gen}' WHERE rollno='${rollno}'`, function (error, results, fields) {
         if (error){
             console.log(error);
         }
           console.log(results); 
         if(results.affectedRows==0){
             return res.status(200).json({
                 Message:"Something wrong with your roll number"
             })
         }else{
             return res.status(200).json({
                 Message:`${rollno} Update Successfully`
             })
         }
      
       });
    }catch(err){
     console.log(`${err}`);
     return res.status(501).json({
          err:err
     })
    }
}
function getUser(req,res){
   try{
          connection.query(`SELECT * FROM USER WHERE sub='${req.payload.sub}'`, function (error, results, fields) {
            if (error){
                console.log(error);
            }
            console.log(results);
            if(results.length<=0){
                return res.status(200).json({
                    Message:"Something wrong with your roll number"
                })
                
            }else{
                if(req.payload.sub==results[0].sub){
                    return  res.status(200).json({
                        Message:`welcome ${results[0].name}`,
                        name:results[0].name,
                        email:results[0].email
                    })
                }else{
                    return  res.status(401).json({
                        Message:"Sub id not match you not allow to access getUserAPI"
                    })
                }
            }
          });
       }catch(err){
        console.log(`${err}`);
        return res.status(501).json({
             err:err
        })
       }
}
module.exports = {
    getAllStudentRecord,
    postSingleRecord,
    getSingleStudentRecord,
    deleteStudent,
    updateStudnt,
    getUser
}
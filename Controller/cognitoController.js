const AmazonCognitoId = require('amazon-cognito-identity-js')
const AWS = require('aws-sdk')
const request = require('request')
const jwkToPem = require('jwk-to-pem')
const jwt = require('jsonwebtoken')
const connection = require("../model/testModel");
require('dotenv').config()
const poolData = {
    UserPoolId:process.env.USERPOOLID,
    ClientId:process.env.CLIENTID
}
const aws_region = "ap-south-1";
const CognitoUserPool = AmazonCognitoId.CognitoUserPool;
const userPool = new AmazonCognitoId.CognitoUserPool(poolData);

async function signup(req,res){
    try{
        const {name,email,password} = req.body;    
        const data = await signUpResult(name,email,password);
        if(data.userSub){
            insertUserInDatabase(name,email,data.userSub,req,res);
        }
        res.status(201).json({
            "Signup successfully":data
        })
    }catch(err){
        if(err.code=="UsernameExistsException"){
            res.status(409).json({
                isUserExist:true,
                message:"email name already exist",
                loginApi:"http://localhost:3000/auth/login",
                VerifyApi:"http://localhost:3000/auth/verify"
            })
        }else if(err.code=="InvalidParameterException"){
            res.status(400).json({
                message:"Provided perameter and data not current",
                currect_structure_example:{
                    name:"example",
                    email:"example@example.com",
                    password:"Example@123"
                }
            })
        }else{
            res.status(400).json({
                "Signup Error":err
            })
        }
    }
   
}

async function login(req,res){
    try{
        const {email,password}= req.body;
        const result = await loginResult(email,password);
       
        res.status(200).json({
            "Login successfully":result 
        }) 
    }catch(err){
        if(err.code=="NotAuthorizedException"){
            res.status(401).json({
                message:"Username or password wrong",
                Yourequest:{
                    email:req.body.email,
                    password:req.body.password
                }
            })
        }else if(err.code="UserNotConfirmedException"){
            res.status(401).json({
                message:"Please verify the otp",
                verifyApi:"http://localhost:3000/auth/verify"
            })
        }
        else{
            res.status(400).json({
                "Login Error":err
            })
        }
    }
   
}

async function verify(req,res){
    const {username,code} = req.body;
    try{
        const result = await verifyCode(username,code);
        if(result){
            updateOfUserVerification(username);
        }
        res.status(200).json({
            "code verify successfully":result
        })        
    }catch(err){
        return res.status(400).json({
            "Code Verify Error":err
        })
    }
}

async function signUpResult(name,email,password){
    return new Promise((resolve,reject)=>{
        try{
            const attributeList = [];
            attributeList.push(new AmazonCognitoId.CognitoUserAttribute({Name:"name",Value:name}))
            attributeList.push(new AmazonCognitoId.CognitoUserAttribute({Name:"email",Value:email}))
            // attributeList.push(new AmazonCognitoId.CognitoUserAttribute({Name:"phone_number",Value:"+919484777533"}))
            userPool.signUp(email,password,attributeList,null,(err,data)=>{
                if(err) reject(err);
                else resolve(data);
            });
        }catch(err){
            console.log(err);
            reject(err);
        }

    });
}

async function loginResult(email,password){
    return new Promise((resolve,reject)=>{
        try{
        const authenticationDetails = new AmazonCognitoId.AuthenticationDetails({
            Username:email,
            Password:password
        });
        const userData = {
            Username:email,
            Pool:userPool
        };
        const cognitoUser = new AmazonCognitoId.CognitoUser(userData);
        cognitoUser.authenticateUser(authenticationDetails,{
            onSuccess:result=>{
                resolve({accessToken:result.getAccessToken().getJwtToken(),
                idToken:result.getIdToken().getJwtToken(),
            refreshToken:result.getRefreshToken().getToken()});
            },
            onFailure:err=>{
                reject(err);
            }
        });  
    }catch(err){
        console.log(err);
        reject(err);
    }   
    })
   
}

async function verifyCode(username,code){
    return new Promise((resolve,reject)=>{
        try{
        //const userPool = new AmazonCognitoId.CognitoUserPool(poolData);
        const userData = {
            Username:username,
            Pool:userPool
        };
        const cognitoUser = new AmazonCognitoId.CognitoUser(userData);
        cognitoUser.confirmRegistration(code,true,(error,result)=>{
            if(error){
                reject(error);
            } else {
               resolve(result)
            };
        })
      }catch(err){
         console.log(err);
         reject(err);
      } 
    });
}
async function codeResend(email){
    return new Promise((resolve,reject)=>{
        try{
            const userData = {
                Username:email,
                Pool:userPool
            };
            const cognitoUser = new AmazonCognitoId.CognitoUser(userData);
            cognitoUser.resendConfirmationCode((error,result)=>{
                if(error){
                    reject(error);
                } else {
                   resolve(result)
                };
            })
            
      }catch(err){
         console.log(err);
         reject(err);
      } 
    });
}

function insertUserInDatabase(name,email,userSub){
    try{
        const sql = `INSERT INTO USER (sub,name,email,isVerified) VALUES ('${userSub}', '${name}', '${email}', 'false')`;
        connection.query(sql,(err,results,fields)=>{
            if(err){
                console.log(err)
            }

        })
    }catch(err){
        console.log(err);
    }
}

function updateOfUserVerification(email){
    try{
       connection.query(`UPDATE USER SET isVerified=true WHERE email='${email}'`, function (error, results, fields) {
         if (error){
             console.log(error);
         }     
       });
    }catch(err){
     console.log(`${err}`);
    }
}

module.exports= {
    signup,
    login,
    verify
}
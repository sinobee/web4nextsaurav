const chaihttp = require("chai-http");
const chai = require('chai');
const server = require("../app");
const { json } = require("express");
const { Token } = require("aws-sdk");

chai.should();
chai.use(chaihttp);
const token = "eyJraWQiOiJcL0o3UkNUXC9RWHFnY3lnSU5Bb3I3Y0kzN3dcLzJnOFhsMDNrS2pVcVltbVFFPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJmY2I1YzYzMC1kODM2LTQ4NDMtYmRiMC1kOTA3NDFjNWNkMWIiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9jN0JqU0F6UFciLCJjbGllbnRfaWQiOiJob3ZiZGEzbjNiMzBodm84MGZkZmJ1N2w3Iiwib3JpZ2luX2p0aSI6IjRmYTBlNTk5LTYwZjItNGFiMC1iMDk5LTc1NzJlOTdlZWYxNCIsImV2ZW50X2lkIjoiODE2ZDViMGMtMjYxZC00NDNhLTkzMzctMDAwOTg3NTI1OTcyIiwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJhd3MuY29nbml0by5zaWduaW4udXNlci5hZG1pbiIsImF1dGhfdGltZSI6MTY4MTczNjg5NywiZXhwIjoxNjgxNzQwNDk2LCJpYXQiOjE2ODE3MzY4OTcsImp0aSI6IjllYzViMTY3LWE4NzMtNDcyZC1iNmVjLTdiMjZjOGM3ODQwZiIsInVzZXJuYW1lIjoidHlwZUB5b3BtYWlsLmNvbSJ9.oxA7W0qZ-7ruK1o_v_1E9JQ6M0JY8Z7VJyzyc0JUlk2cde7-v1IlGY0Ssp34uuBvkCOuj1ldWp6J1nwJvH2ebXq2c-AUjwlegr-Ypw97b2WJk-wLIiafh5P1zClDRp4Kq83-LCsvbT_QAf8y1JCMAw2qrPG5cSsb32WtwWRo_2xkRJyK9iDextgWN1SiJ8UDvL6i34Gw9tXupOifMWlTyP8zCcmCYyjY1onFVxjyE_w-VGYf47ap1uteXD3eosXbH4jkabamql_Xf3enn__nzWUEri9LQ_EhBbmxueB0DDrW80uEyd5WccbtvREKDrTxbqYrO0xiUub7JPYzEk2dKw";
describe("POST /auth/signup",()=>{
  
   const val  = Math.random();
    it('User resigter',(done)=>{
        const user ={
            name:"singh saurav m",
            email:"cbdn123@yopmail.com",
            password:"Admin@123"
        }
        chai.request(server).post("/auth/signup").send(user).end((err,res)=>{
            res.should.have.status(201);
            done();
        })
    })

    it("User alread exist",(done)=>{
        const user ={
            name:"singh saurav m",
            email:"type@yopmail.com",
            password:"Admin@123"
        }
        chai.request(server).post("/auth/signup").send(user).end((err,res)=>{
            res.should.have.status(409);
            done();
        })

    })

    it("All field is required",(done)=>{
        const user ={
            name:"",
            email:"asde@yopmail.com",
            password:""
        }
        chai.request(server).post("/auth/signup").send(user).end((err,res)=>{
            res.should.have.status(400)
            done();
        })
    })
})


describe("POST /auth/login",()=>{
    it("Login to account", (done)=>{
        const user = {
            email:"type@yopmail.com",
            password:"Admin@123"
        }
        //const token = "eyJraWQiOiJcL0o3UkNUXC9RWHFnY3lnSU5Bb3I3Y0kzN3dcLzJnOFhsMDNrS2pVcVltbVFFPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJmY2I1YzYzMC1kODM2LTQ4NDMtYmRiMC1kOTA3NDFjNWNkMWIiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9jN0JqU0F6UFciLCJjbGllbnRfaWQiOiJob3ZiZGEzbjNiMzBodm84MGZkZmJ1N2w3Iiwib3JpZ2luX2p0aSI6IjE0MjQ2N2JkLWVkM2UtNGI1YS04MDI3LTJjYmYwODQxMDAzZiIsImV2ZW50X2lkIjoiMmZiNzkyNjktODQ1OS00NGIzLTkwODktNWFlMDY4OGQ1MWRiIiwidG9rZW5fdXNlIjoiYWNjZXNzIiwic2NvcGUiOiJhd3MuY29nbml0by5zaWduaW4udXNlci5hZG1pbiIsImF1dGhfdGltZSI6MTY4MTcyNzM5MSwiZXhwIjoxNjgxNzMwOTkxLCJpYXQiOjE2ODE3MjczOTEsImp0aSI6IjI1NWNkNzYyLWVkNGMtNGNkMy1hMjdmLTNhOThlNDkxZjQyZiIsInVzZXJuYW1lIjoidHlwZUB5b3BtYWlsLmNvbSJ9.ubBzUxhtoAQ4jzS2Efpbmu1dUXs-aDK163b100b8wCPF9reFOsedQBNcU0B0qwOb7eH54FEuFQWIkFUtiRPmqsd3RObi5XN2O6GvvWsYlsRjEZicDodo2_RtJeob5OIbJ9XktMg79ozOLinhCcGA1lCL0uAswF05mjgwIhdtbt8eJdb8rwp2i4nN7XLR8IsZOxujo4cyOq9x4iSr73k2VjaDMhbAJXnbYB2850DGX0cRb8T5a23TJnEcTNzl0GfG5EfRjs5Gt2MXUdRuAvfx1uScoi41adsd_uEdB0JbC3RziORCx-7NI4hP-X9rXP-XC6QVN88snOCw2nvPu0jNFA"
        chai.request(server).post("/auth/login").send(user).end((err,res)=>{
            
             res.should.have.status(200);
             done();
        })
    })

    it("Username and password is wrong",(done)=>{
        const user = {
            email:"type@yopmail.com",
            password:"Admin@1"
        }

        chai.request(server).post("/auth/login").send(user).end((err,res)=>{
            res.should.have.status(401);
            done();
        })
    })

    it("User not confirmed",(done)=>{
        const user = {
            email:"gan@yopmail.com",
            password:"Admin@123" 
        }

        chai.request(server).post("/auth/login").send(user).end((err,res)=>{
            res.should.have.status(401);
            done();
        })
    })
})

describe("GET /test",()=>{
     it("Get All data ",(done)=>{
        chai.request(server).get("/test").set("authorization", "Bearer " + token).end((err,res)=>{
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property("total_result")
            res.body.should.have.property("data");
            done()
        })
        
     })

     it("Get all data without athorization header",(done)=>{
        chai.request(server).get("/test").end((err,res)=>{
            res.should.have.status(400);
            res.body.should.be.a('object');
            done()
        })
     })

})

describe("GEt /test:rollNo",()=>{
    it("Get single data",(done)=>{
        // const roll = 102;
        chai.request(server).get('/test/102').set("authorization", "Bearer " + token).end((err,res)=>{
            res.should.have.status(200);
            res.body.should.be.a('object');
            done();
        })
    })

    it("Requested data not found in database",(done)=>{
        const roll = 112;
        chai.request(server).get(`/test/${roll}`).set("authorization", "Bearer " + token).end((err,res)=>{
            res.should.have.status(400);
            res.body.should.be.a('object');
            done();
        })  
    })
})

describe("POST /test",()=>{
    it("Post single info",(done)=>{
        const student = {
            rollno:109,
            name:"Nanu singh",
            clas:12,
            section:"C",
            gen:"Male"
        }
        chai.request(server).post("/test").set("authorization", "Bearer " + token).send(student).end((err,res)=>{
            res.should.have.status(200);
            done();
        })
    })
    it("Dublicate primary Key",(done)=>{
        const student = {
            rollno:104,
            name:"Nanu singh",
            clas:12,
            section:"C",
            gen:"Male"
        }
        chai.request(server).post("/test").set("authorization", "Bearer " + token).send(student).end((err,res)=>{
            res.should.have.status(500);
            done();
        })
    })

    it("All field required",(done)=>{
        const student = {
            rollno:104,
            name:"",
            clas:12,
            section:"",
            gen:"Male"
        }
        chai.request(server).post("/test").set("authorization", "Bearer " + token).send(student).end((err,res)=>{
            res.should.have.status(409);
            done();
        })
    })
    
})
require('dotenv').config()
const fetch = require('node-fetch');
const jwkToPem = require('jwk-to-pem')
const jwt = require('jsonwebtoken')
const REGION="us-east-1";
const USERPOOLID="us-east-1_c7BjSAzPW";
const keysUrl ='https://cognito-idp.'+'us-east-1'+'.amazonaws.com/' +'us-east-1_c7BjSAzPW'+'/.well-known/jwks.json';
module.exports = async(req,res,next)=>{
    if(req.headers.authorization==null){
        return res.status(400).json({
          Message:"Token is required"
        })
      }
    const token = req.headers.authorization.split(" ")[1];
    async function fetchKeys() {
        const publicKeysResponse = await fetch(keysUrl);
        const responseJson = await publicKeysResponse.json();
        return responseJson.keys;
      }
      const keys =await fetchKeys();
      validateToken(keys,token);
      function validateToken(keys,token){
            pems = {};
           for(var i = 0; i < keys.length; i++) {
                var key_id = keys[i].kid;
                var modulus = keys[i].n;
                var exponent = keys[i].e;
                var key_type = keys[i].kty;
                var jwk = { kty: key_type, n: modulus, e: exponent};
                var pem = jwkToPem(jwk);
                pems[key_id] = pem;
           }
                var decodedJwt = jwt.decode(token, {complete: true});
                if (!decodedJwt) {
                    console.log("Not a valid JWT token");
                    res.status(401);
                    return res.send("Invalid token");
               }
               var kid = decodedJwt.header.kid;
               var pem = pems[kid];
               if (!pem) {
                   res.status(401);
                  return res.send("Token may expired");              
               }
                 jwt.verify(token, pem, function(err, payload) {
                 if(err) {
                     res.status(401);
                     
                     return res.send("Invalid tokern");
                } else {
                        req.payload=payload;
                       next();
                 }
            });
     }
    }


    
















        // const params = {
    //     region:process.env.POOL_REGION,  // required
    //     userPoolId: process.env.USERPOOLID, // required
    //   }
      
    //   const verifier = new Verifier(params);
      
    //   verifier.verify(token)
    //   .then(result =>{
    //     if(result){
    //         next();
    //     }else{
    //         return res.status(498).json({
    //             message:"Invalid token",
    //             token:token
    //         })
    //     }
    //   }).catch((err)=>{
    //     return res.status(498).json({
    //         message:"Invalid token",
    //         err:err
    //     })
    //   });


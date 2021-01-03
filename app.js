const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const { static, request, response } = require("express");
const { url } = require("inspector");

const app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

     var data = {
         members: [
             {
                 email_address: email,
                 status: "subscribed",
                 merge_fields: {
                     FNAME: firstName,
                     LNAME : lastName
                 }
             }
         ]
     };

     const jsonData = JSON.stringify(data);
     const url = "https://us7.api.mailchimp.com/3.0/lists/listidhere";        //list id here

     const options = {
         method: "POST",
         auth: "any name:apikey"      //api key here
     }
     const request = https.request(url, options, function(response){

        if (response.statusCode === 200) {
            res.send("Successfully Subscribed");
        } else {
            res.send("Error");
        }

         response.on("data", function(data){
            console.log(JSON.parse(data)); 
         });
     });

     request.write(jsonData);
     request.end();
});
 
app.listen(3000 , function(){
    console.log("Server is running in port 3000");
});



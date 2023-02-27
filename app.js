const express = require("express");
const nodeMailer = require("nodemailer")
const bodyParser = require("body-parser");
const request = require("request")
const dotenv = require("dotenv").config();

// const https = require("https")

const app = express();
app.use(express.static("public"))

app.use(bodyParser.urlencoded({ extended: true }));


app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html")
});




app.post("/", (req, res) => {
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let email = req.body.email;
  
    let data = {
      members: [
        {
          email_address: email,
          status: "subscribed",
          merge_fields: {
            FNAME: firstName,
            LNAME: lastName
          }
        }
      ]
    };
  
    let jsonData = JSON.stringify(data);
    
    const uri = `https://us8.api.mailchimp.com/3.0/lists/${process.env.MAILCHIMP_LIST_ID}`;
  
    let options = {
      url: uri,
      method: "POST",
      auth: {
        user: 'temi',
        pass: process.env.MAILCHIMP_APIKEY
      },
      body: jsonData
    };
  
    request(options, (error, response, body) => {
      if (response.statusCode === 200) {
        res.sendFile(__dirname + "/success.html")
      } else {
        res.sendFile(__dirname + "/failure.html")
      }
    });
  });
  
//   post request for failure page(Try Again)
app.post("/failure", (req, res) => {
    res.redirect("/")
})

app.post("/success", (req, res) => {
    res.redirect("/")
});

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});
//jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const request = require('request');
require('dotenv').config()

const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));

app.get('/', (req,res) => {
    res.sendFile(__dirname + '/signup.html');
});

app.post('/', (req,res) => {
    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const email = req.body.email;

    //An array of objects(members)
    const data = {
        members: [
            {
                email_address:email,
                status: 'subscribed',
                merge_fields:{
                    FNAME: firstName,
                    LNAME: lastName,
                }
            }
        ]
    };
    
    const id = process.env.MAILCHIMP_ID

    const jsonData = JSON.stringify(data);
    const listId = id;
    const url = 'https://us19.api.mailchimp.com/3.0/lists/' + listId;

    const password = process.env.MAILCHIMP_PASSWORD

    const options = {
        method:'POST',
        auth: password,
    }

    const request = https.request(url,options, (response) => {

        if(response.statusCode === 200){
            res.sendFile(__dirname + '/success.html');
        }else{
            res.sendFile(__dirname + '/failure.html');
        }
        
        response.on('data',(data) => {
            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData); 
    request.end();
});


app.post('/failure', (req,res) => {
    res.redirect('/'); //app.get('/') goes to the here
});



app.listen(process.env.PORT || 3000,() => {
    console.log("Server is running port 3000.");
});


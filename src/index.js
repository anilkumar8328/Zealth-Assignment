const express = require('express');
const app = express();
const route = require('./routes/route.js');
const mongoose = require('mongoose');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//put your data base cridentials 
mongoose.connect("", {
        useNewUrlParser: true
    })
    .then(() => console.log("MongoDb is connected"))
    .catch(err => console.log(err));

app.use('/', route);

app.listen(process.env.PORT || 3000, (err) => {
    console.log("Connected to port 3000")
});
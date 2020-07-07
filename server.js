const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const request = require('request');
const dbconfig = require('./config/config');
const routes = require('./routes/routes');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();


mongoose.connect(
    dbconfig.url,{
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology:true
    }
).
then(() => {
    console.log('MongoDB Database started on server and connected successfully');
})
.catch(err => { 
console.log('Error connecting to Mongo Database, err...',err);
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());

routes(app);

// port =  3000;
app.listen(process.env.PORT);
console.log('Server started on port:',process.env.PORT);
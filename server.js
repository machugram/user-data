const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
//var router = express.Router();


const dbconfig = require('./config/config');
const routes = require('./routes/routes');


mongoose.connect(
    dbconfig.url,{
        useNewUrlParser: true,
        useFindAndModify: false
    }
).
then(() => {
    console.log('Mongo Database started on server and connected successfully');
})
.catch(err => { 
console.log('Error connecting to Mongo Database, err...',err);
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

routes(app);

// app.get('',(req,res) => {
//     //whatever
// })


port =  8000;
app.listen(port);
console.log('Server started on port:',port);
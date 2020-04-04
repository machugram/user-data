const catalogue = require('../models/model');

exports.createUser = (req,res,next) => {
    newuser = new catalogue ({
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email ,
        address: req.body.address,
    })
    newuser.save((err,asset) => {
        if(err)
        res.send(err);

        res.status(200).json({
            message: "User data saved",
            name: req.body.name
        });
    })
    console.log(newuser);
};

exports.getUsers = (req,res) => {
    catalogue.find({},'-_id',(err,users) => {
        if(users.length <= 0 ){
            res.json('No data found');
        }
        else{res.status(200).json(users)}  
    })
    };
    
exports.getUser = (req,res) => {
        console.log('params',req.params.name);
         catalogue.find({name: {$regex: '.*' +  req.params.name + '.*'}},'-_id',(err,user) => {
             if(err)
                res.send(err);
                if(user.length <= 0 ){
                    res.json('No data found');
                }
                else{res.status(200).json(user)}           
           })
        };
    
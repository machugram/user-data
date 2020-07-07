const User = require('../models/model');
const bcrypt = require('bcrypt');
const saltRounds = 8;
const async = require('async');
const request = require('request');
const _ = require('underscore');
//const base64 = require('base-64');
//const utf8  = require('utf8');
//const generator = require('generate-password');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { findOne } = require('../models/model');
const { stringify } = require('querystring');
const { result } = require('underscore');
email = process.env.MAILER_EMAIL_ID || 'rexfordmachu@gmail.com';
//pass = process.env.MAILER_PASSWORD || 'kingmachu';
pass = 'hi'
//const token = "accountactivatekey12345"


var smtpTransport = nodemailer.createTransport({
  service: process.env.MAILER_SERVICE_PROVIDER || 'Gmail',
  auth: {
    user: email,
    pass: pass
  }
});


exports.createUser = (req,res,next) =>{
    // let password = req.body.password;
    // if(!req.body.password){
    //   password =   generator.generate({
    //         length: 10,
    //         numbers: true,
    //         uppercase: true,
    //         lowercase:false,
    //         symbols: false,
    //         excludeSimilarCharacters:true,
    //         exclude: 'm',
    //         strict: true

    //     });
    // }
    // console.log(password);
    // let duplicateUser = User.findOne({email:req.body.email})
    // console.log(duplicateUser.email);
    // if(!duplicateUser){
    //   return res.status(400).json({error:"User already exists"});
      
    // }

    // User.findOne({email:req.body.email}).exec((err,user)=>{
    //   if(user){
    //     return res.status(400).json({error:"User with this email exists"})
    //   }
    // })

    //Using the email to ensure user is unique
    User.findOne({email:req.body.email},(err,user)=>{
      if(user){
        return res.status(400).json({error:"Thie email exists already. Forgot Password?"});
      }
    bcrypt.hash(req.body.password,saltRounds, (err,hash) => {
      newuser = new User ({
          name: req.body.name,
          phone: req.body.phone,
          email: req.body.email ,
          address: req.body.address,
         password :  hash,
      })
      newuser.save((err,user) => {
          if(err)
          res.send(err);
          //Create a web token
          let result = {}
         const payload = { id: newuser.id };
          // const payload = { user: newuser };
          const options = { expiresIn: '24h', issuer: 'https://localhost:3000' };
          const secret = 'process.env.JWT_SECRET452455';
          const token = jwt.sign(payload,secret,options);
          //use base64.decode to decode payload . FOund another but still try this.
          console.log(token);
          result.token = token;
          result.result = newuser;
          // result.code = stringify(token)
          // result.decoded = utf8.decode(base64.decode(stringify(token)))
          res.send(result);
          // user.token = token


          // res.status(200).json({
          //     message: "User data saved",
          //     name: req.body.name
          // });
      })
      console.log(newuser);
  })
    })
    
};

exports.getUsers = (req,res) => {
    User.find({},'-_id',(err,users) => {
        if(users.length <= 0 ){
            res.json('No data found');
        }
        else{res.status(200).json(users)}  
    }).sort({name: 1})
    };

exports.signIn = (req,res) => {
    let result = {};
    User.findOne({email: req.body.email})
        .then((user) => {
            if(!user){
                res.send('Email does not exist.Confirmed');
            }
            else{
                bcrypt.compare(req.body.password,user.password, (err,match) => {
                    if(match == true){
                        //var token = req.headers['x-access-token'];
                       let payload = {id:user.id};
                       let secret = 'process.env.JWT_SECRET452455';
                       let options = {expiresIn:Date.now()+1200,issuer:process.env.ISSUER}
                       const token3 = jwt.sign(payload,secret,options);

                        if (!token3) return res.status(401).send({ auth: false, message: 'No token provided.' });
                        jwt.verify(token3, 'process.env.JWT_SECRET452455', function(err, decoded) {
                          if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
                          
                          User.findById(decoded.id, function (err, user) {
                            if (err) return res.status(500).send("There was a problem finding the user.");
                            if (!user) return res.status(404).send("No user found.");
                            
                            res.status(200).send(user);
                          });
                        });
                    }
                    else{
                        res.status(200).send('Incorrect password');
                    }
                });
            }
        })
        .catch( err => {
            res.send(err);
            console.log(err);
            
        })
    };
    
exports.getUser = (req,res) => {
        console.log('params',req.params.name);
         User.find({name: {$regex: '.*' +  req.params.name + '.*'}},'-_id',(err,user) => {
             if(err)
                res.send(err);
                if(user.length <= 0 ){
                    res.json('No data found');
                }
                else{res.status(200).json(user)}           
           })
        };

exports.updateUser = (req,res,next) => {
    User.findOneAndUpdate({name: req.params.name},req.body, (err,update) => {
        if(err){
            res.status(500).json(err);
        }
        res.json(update);

    });
};
//     function(user, token, done) {
//       console.log(token);
//       User.findByIdAndUpdate({ _id: user._id }, {resetLink:'ionhyyy'}, { upsert: true, new: true }).exec(function(err, new_user) {
//         done(err, token, new_user);
//       });
//     },

exports.forgotPassword = (req, res) => {
  User.findOne({email: req.body.email})
  .exec((err, user) => {
    if (user){
      let options = {expiresIn:Date.now()+86400,issuer:process.env.ISSUER};
      let token = jwt.sign({id:user.id},process.env.SECRET_KEY,options); 
      User.findByIdAndUpdate({_id:user._id},{resetLink:token,resetPasswordToken:token,resetPasswordExpires:Date.now()+864000},{upsert:true,new:true})
      .then((result)=>{
        console.log(user);
        let data = {
            to: user.email,
            from: email,
            subject: 'Password help has arrived!',
            text: {
              url: 'http://localhost:3000/auth/reset_password/' + token,
              name: user.name.split(' ')[0]
            },
            html:`<h2>Please click on the link below to reset password</h2>
            <a href=""Google></a>`
          };
          console.log(data);

          smtpTransport.sendMail(data, function(err){
            if (!err){return res.json({ message: 'Kindly check your email for further instructions' });}
            else {res.send('Email was not delivered. Kindly check your internet connection.')}
          }); 
        });
      }
        else{
          res.send('User not found/Email does not exist');
          return res.status(422).json({ message: err });

        }
      });
    };

exports.resetPassword = (req, res, next) =>{
  User.findOne({resetPasswordToken:req.params.token,resetPasswordExpires:{$gt: Date.now()}})
  .then((user,err)=>{
    if(!err && user){
      if(req.body.newPassword === req.body.verifyPassword){
        user.password = bcrypt.hashSync(req.body.newPassword,10);
        user.resetPasswordToken = undefined  || '';
        user.resetPasswordExpires = undefined || '';
        user.save((err)=>{
          if(err){
            return res.status(422).send({message:err});
          }
          else{
            var data = {
            to: user.email,
            from: email,
            subject: 'Password Reset Confirmation',
            text : `Hello, your password has been updated.Login and enjoy our services.`,
            html: `<h2>Hello</h2>`
            };
        smtpTransport.sendMail(data,(err)=>{
          if(!err)
          console.log(`Message sent: ${info}`);
          res.redirect('/sign',200);
          return res.json({message:'Password Reset'});
        });
          }
        })
      }
      else{
        return res.status(422).send({
        message: 'Passwords do not match'
        });
      }
    }})
  .catch(err =>{
    return res.status(400).send({err:err});
  })
};

exports.externalApi = (req,res,next) => {
  request({
    method: 'GET',
    uri: 'http://sg.media-imdb.com/suggests/a/aliens.json',}
    , function(err, response, body) {
    var data = body.substring(body.indexOf('(')+1); 
    data = JSON.parse(data.substring(0,data.length-1));
     var related = [];
    _.each(data.d, function(movie, index) {
    related.push({ Title: movie.l,
    Year: movie.y,
    Poster: movie.i ? movie.i[0] : '' });
});
res.json(related); }
);
};
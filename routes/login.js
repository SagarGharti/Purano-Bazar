const Joi = require('@hapi/joi');
const bcrypt = require('bcryptjs');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session')
const route = express.Router();
const saltRounds = 10;
var con = require('../config/database.js').con;
var urlencodedParser = bodyParser.urlencoded({extended:false});
//middleware//
route.use(session({
    key:'session_cookie_name',
    secret:'secret',
    //store:sessionStore,
    resave:true,
    saveUninitialized: true
}));

    // route.all('/*',(req,res,next)=>{
    //     req.app.locals.layout = 'register';
    //     next()
    // })

    // route.get('/', (req, res)=>{
    //     res.render('seller/welcome');
    // })

    route.get('/seller',function(req,res){
        res.render('seller/register',{qs:req.query})
        
    });

    route.post('/seller',urlencodedParser,function(req,res){
        const schema = Joi.object({
            name: Joi.string().min(3).max(30).required(),
            email: Joi.string().email({minDomainSegments:2,tlds:{allow:['com']}}),
            password: Joi.string().pattern(/^[a-zA-Z0-9]{3,30}$/),
            password2: Joi.ref('password'),
        });
        const {value,error} = schema.validate(req.body)
        if(error){
            res.status(400).send(error.details[0].message);
            return;
        }else{
            const name = value.name;
            const email = value.email;
            const password = value.password;

            con.query('Select * from register Where email = ?',[email],function(error,results){
                if(results.length == 0){
                        bcrypt.hash(password,saltRounds,function(error,hash){
                        var sql = "insert into register (name,email,password) values(?,?,?)";
                        con.query(sql,[name,email,hash],function(err){
                            if (err) {
                                console.log(err)
                            }
                            else{
                                res.render('seller/register',{ title:'Data saved',
                                message:'Data saved succedfully.'})
                            }
                        })
                    })
                }else{
                    res.send("Email is already taken");
                }   
            })

          
        }
      
    });
   
    route.get('/user',function(req,res){
        res.render('seller/login',{qs:req.query})
        
    });

    route.post('/user',urlencodedParser,function(req,res){
        var email = req.body.email;
        var password = req.body.password;
        console.log(password)
        if(email && password){
            con.query('Select * from register Where email=?',[email],function(error,results){
                console.log(results[0].password)
                if(results.length > 0){
                      bcrypt.compare(password,results[0].password,function(error,isMatch){
                        //store value of id in session variable 
                        // var user_id;
                        if(!isMatch){
                            console.log("password doesnot match")
                        }
                        else{
                            login_user_id= results[0]['id'];
                            login_user_role = results[0]['user_role'];
                            con.query('Select * from register Where email =?',results[0]['email'],function(error,results){
                                    // console.log(results);
                                    req.session.login_user_id=login_user_id;
                                    req.session.login_user_role=login_user_role;
                                    user_role = login_user_role;
                                        // console.log(req.session.login_user_id)
                                    con.query('Select category_id,item_name,model,price,image_dir,description,user_id from items Where user_id=?',[login_user_id],function(error,results){
                                        console.log('hello');
                                        if(results.length>0){
                                            res.redirect('/admin');
                                        }else{
                                             res.redirect('/home');
                                        }
    
                                    })
                                                                      
                            });
                        }
                    });          
                } 
            });   
        }else{
            console.log('email doesnot match')
        }                             
    });

 
    

  

module.exports = route;
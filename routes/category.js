const express= require('express');
const bodyParser = require('body-parser');
const multer = require('multer')
const route =express.Router();
var con = require('../config/database.js').con;
var urlencodedParser = bodyParser.urlencoded({extended:false});

//set storage Engine
const multerConf ={
    storage: multer.diskStorage({
        destination: './uploads',
        filename: function(req, file, cb){
           
            cb(null, file.fieldname + '-' +Date.now())
        }
    }),   
    filefilter: function(req,file,cb){
        if(!file){
            cb();
        }
        const image = file.mimetype.startswith('image/');
        if(image){
            cb(null,true);
        }else{
            cb({message:"file type not suported"},false)
        }
    } 
} 


route.get('/add',(req,res)=>{
    // res.send('category route called');
    res.render('admin/cat',{layout:'layout'})
});
route.post('/add',urlencodedParser,function(req,res){
    const category = req.body.category;
    const description = req.body.description;
    var sql = "insert into category(category_name) values(?)";
    con.query(sql,[category],function(err){
        if(err){
            console.log(err)
        }
        else{
            res.redirect('/')
        }
    })
  
});

route.get('/show',(req,res)=>
{
    con.query("Select category_name From category",function(err,result,fields){
        if(err) throw err;
        res.render('admin/view', {layout:'layout',result})
    })
});


route.get('/adds',(req,res)=>{
    con.query("Select category_id, category_name From category",function(err,result,fields){
        if(err) throw err;
        res.render('admin/item',{layout:'layout',result})
    })
    
});

route.post('/adds',multer(multerConf).single('myImage'),urlencodedParser,function(req,res){
    const category_id = req.body.category_id
    const name = req.body.name
    const model = req.body.model
    const price = req.body.price
    const description = req.body.description
    const user_id = req.session.login_user_id
    if(req.file){
        //console.log(req.file);
        req.body.myImage = req.file.filename
    }
    const myImage =req.body.myImage
    var sql = 'insert into items(category_id,item_name,model,price,image_dir,description) values(?,?,?,?,?,?)'
    con.query(sql,[category_id,name,model,price,myImage,description,user_id],(err,results)=>{
         if(!err){
             console.log("sucessfully inserted");
             res.redirect('/');
         }else{
             console.log("unable to saved",err)
         }
    });
    
});

route.get('/items',(req,res)=>
    con.query("Select id,item_name,model,price,image_dir,description From purano.items",function(err,result,fields){
    if(err)
    {
        console.log(err);
    }else{
        res.render('admin/show', {layout:'layout',result})
    }
   })
);


route.post('/updateStatus',urlencodedParser,function(req,res){
    const id = req.body.id;
    let status = false;
    if(req.body.status == "true"){
        status = true
    }else{
        status = false
    }
    console.log(id)
    console.log(status);
    var sql = "update items set status=? where id=?";
    con.query(sql,[status,id],function(err){
        if(err){
            res.json({'success':false, 'message':'updated failed'})
        }
        else{
            res.json({'success':true, 'message':'updated sucessful'})
        }
    })
  
});

route.get('/brand',(req,res)=>{
    con.query("Select id, model From items",function(err,result,fields){
        console.log(result)
        if(err){
            console.log(err);
        }else{
            res.render('admin/model', {result});
        }

    })
})


module.exports= route;
const express = require('express');
const path = require('path');
const expresshbs = require('express-handlebars');
const Handlebars = require('handlebars-helpers')
const session = require('express-session');
const hbs = expresshbs.create({
    defaultLayout: 'register',
    extname: 'hbs',
    
    helpers: {
        'dec': function(arg1, options){
            return parseInt(arg1) + 1
        },
        'isActive':function(arg1){
            if(arg1 == true){
                return 'checked';
            }else{
                return '';
            }
        },
        
        'userRole':function(user_role){
            if(user_role == 1){
                return true;
            }else{
                return false;
            }
        }
    }
})

const app = express();
// const flash = require('connect-flash');
// var MySQLStore = require('express-mysql-session')(session);
// var options = {
    // host: 'localhost',
    // port:4000,
//     user:'root',
//     password: '',
//     database: 'Purano'
// };
// var sessionStore = new MySQLStore(options);
app.engine('.hbs', hbs.engine)

//template setup
// app.use(expressLayout);
app.set('views',path.join(__dirname,'views'));
app.set('view engine','hbs');

//css setup
app.use(express.static(path.join(__dirname + '/public')));

//middle_ware session
app.use(session({
     key:'session_cookie_name',
     secret:'secret',
     //store:sessionStore,
     resave:true,
     saveUninitialized: true
}));

//connect flask
// app.use(flash());
//Global vars
// app.use((req,res,next)=>{
//     res.locals.sucess_msg = req.flash('success_msg');
//     res.locals.errors_msg = req.flash('error_msg');
//     next();
// });

app.use('/',require('./routes/index'));
app.use('/cat',require('./routes/category'));
app.use('/view',require('./routes/category'));
app.use('/items',require('./routes/category'));
app.use('/show',require('./routes/category'));
app.use('/model',require('./routes/category'));
app.use('/auth',require('./routes/login'));
//app.use('/login',require('./routes/login'));
app.use('/register',require('./routes/login'));
app.use('/login',require('./routes/login'));
app.get('/seller/dashboard',(req,res)=>
{
    res.render('seller/dashboard',{results});
})
//app.use('/cat',require('./routes/category'));
// app.use('/store_category',require('./routes/category'));

app.listen(4000,()=>{
    console.log('server is running 4000')
});

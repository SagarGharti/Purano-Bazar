const express = require('express');
const route = express.Router();

route.get('/', (req, res) => {
    res.render('seller/welcome',{layout:'register'})
});

route.get('/home', (req, res) => {
    res.render('layouts/userLayout')
});
route.get('/admin',(req,res) => {
    res.render('layouts/layout')
});
module.exports= route;
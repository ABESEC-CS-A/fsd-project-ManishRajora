const express = require('express');
const studentRouter = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Notices_Database  = require('../Model/notices.js').Notices_Database;
const Student_Database = require('../Model/student.js').Student_Database;



//signup login:

studentRouter.post('/login',async(req,res)=>{
    // console.log(req.body.password);
    const a = await Student_Database.findOne({emailid:req.body.emailid});
    if(!a){
        res.json("User not exist");
        return;
    }
    const ismatch = bcrypt.compare(req.body.password,a.password);
    if(!ismatch){
        res.json("Invalid password");
        return;
    }
    const token = jwt.sign({emailid:req.body.emailid},process.env.SECRET_KEY,{expiresIn:'1h'});
    res.json({"message":"Success","token":token});
})

studentRouter.post('/signup',async(req,res)=>{
    const existing = await Student_Database.findOne({emailid:req.body.emailid});
    if(existing){
        res.json({"message":"User already exist"});
        return;
    }
    const a = new Student_Database(req.body);
    a.passwrod = bcrypt.hash(req.body.password,10);
    await a.save();
    const token = jwt.sign({emailid:req.body.emailid},process.env.SECRET_KEY,{expiresIn:'1h'});
    res.json({"message":"Success","token":token});
})






// notices:

const auth = (req,res,next)=>{
    try{
        const authheader = req.headers.authorization;
        const token = authheader.split(" ")[1];
        const decoded = jwt.verify(token,process.env.SECRET_KEY);
        next();
    }
    catch(err){
        res.json("Authentication Failed");
    }
}

studentRouter.get('/notices',auth,async(req,res)=>{
    const data = await Notices_Database.find({department:req.body.department});
    res.json(data);
})




studentRouter.get('/profile',async(req,res)=>{
    const profile_data = await Student_Database.find()
})

exports.studentRouter=studentRouter;
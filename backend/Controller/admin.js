const express = require('express');
const adminRouter = express.Router();
const Admin_Database = require('../Model/admin.js').Admin_Database;
const Notices_Database = require('../Model/notices.js').Notices_Database;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
adminRouter.post('/login',async(req,res)=>{
    const a = await Admin_Database.findOne({emailid:req.body.emailid});
    // console.log(a);
    if(!a){
        res.json("User not exist");
        return;
    }
    const ismatch = await bcrypt.compare(req.body.password,a.password);
    if(!ismatch){
        res.json("Invalid password");
    }
    const token = jwt.sign({emailid:req.body.emailid},process.env.SECRET_KEY,{expiresIn:'1h'});
    res.json({"message":"Success","token":token});
})
adminRouter.post('/signup',async(req,res)=>{
    const existing = await Admin_Database.findOne({emailid:req.body.emailid});
    if(existing){
        res.json("User already exist");
        return;
    }
    const hashedPassword = await bcrypt.hash(req.body.password,10);
    const a = await new Admin_Database(req.body);
    a.password = hashedPassword;
    await a.save();
    const token = jwt.sign({emailid:req.body.emailid},process.env.SECRET_KEY,{expiresIn:'1h'});
    res.json({"message":"Success","token":token});
})



const auth=(req,res,next)=>{
    try{
        const authheader=req.headers.authorization;
        token = authheader.split(" ")[1];
        console.log(token);
        decoded = jwt.verify(token,process.env.SECRET_KEY); 
        console.log(decoded);
        next();
    }
    catch(err){
        res.json("authentication failed");
    }
}

adminRouter.get('/notices',auth,async(req,res)=>{
    const data = await Notices_Database.find({department:req.body.department});
    res.json(data);
})
adminRouter.post('/notices',auth,async(req,res)=>{
    const a = await new Notices_Database(req.body);
    await a.save();
    res.json("Success");
})
adminRouter.delete('/notices',auth,async(req,res)=>{
    const a = await Notices_Database.findOneAndDelete({department:req.query.department},{title:req.query.title});
    res.json("Success");
})


exports.adminRouter=adminRouter;
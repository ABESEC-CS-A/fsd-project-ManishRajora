const express = require('express');
const server = express();
const cors = require('cors');
const mongoose = require('mongoose');
const adminRouter = require('./Controller/admin.js').adminRouter;
const studentRouter = require('./Controller/student.js').studentRouter;
require('dotenv').config();

async function main(){
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Database connected");

}
main().catch(err=>console.log(err));
server.use(cors());
server.use(express.json());
server.use('/admin',adminRouter);
server.use('/student',studentRouter);
server.listen(8080,()=>{
    console.log("Server is running");
})

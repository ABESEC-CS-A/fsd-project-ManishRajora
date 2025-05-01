const express = require('express');
const mongoose = require('mongoose');
const {Schema}  =  mongoose;


const student_schema = new Schema({
    emailid:{type:String},
    password:{type:String},
    department:{type:String}
})


exports.Student_Database = mongoose.model('students',student_schema);

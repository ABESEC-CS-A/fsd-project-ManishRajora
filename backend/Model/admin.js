const express = require('express');
const mongoose = require('mongoose');
const {Schema} = mongoose;

const admin_schema = new Schema({
    emailid:{type:String},
    password:{type:String},
    department:{type:String}
})


exports.Admin_Database = mongoose.model('admins',admin_schema);
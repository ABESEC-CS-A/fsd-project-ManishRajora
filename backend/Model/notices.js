const mongoose = require('mongoose');
const {Schema} = mongoose;
const notices_schema = new Schema({
    department:{type:String},
    title:{type:String},
    content:{type:String}
})


exports.Notices_Database = mongoose.model('notices',notices_schema);
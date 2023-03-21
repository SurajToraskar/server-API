const mongoose=require('mongoose');

const schema=new mongoose.Schema({
    name:String,
    genre:String,
    rating:Number
})

module.exports= mongoose.model('AnimeName',schema);
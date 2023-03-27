const mongoose=require('mongoose');

const deptSchema=new mongoose.Schema({
  name:{
    type:String,
    required:true
  }
})

const deptModel=mongoose.model('departments',deptSchema);

module.exports=deptModel;
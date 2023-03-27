const mongoose=require('mongoose');

const subjectSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    department_id:{
        type:mongoose.Schema.ObjectId,
        required:true,
        ref:"departments"
    },
    teacher_id:{
        type:mongoose.Schema.ObjectId,
        required:true,
        ref:"teacherdetails"
    }
})

const subjectModel=mongoose.model('subjects',subjectSchema);
module.exports=subjectModel;
const mongoose=require('mongoose');

const attendanceSchema=new mongoose.Schema({
    teacher_id:{
        type:mongoose.Schema.ObjectId,
        required:true,
        ref:'teacherdetails'
    },
    student_id:{
        type:mongoose.Schema.ObjectId,
        required:true,
        ref:"departments"
    },
    download_file_path:{
        type:String,
        required:true
    }
})

const attendanceModel=mongoose.model('attendance',attendanceSchema);

module.exports=attendanceModel;
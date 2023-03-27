const express = require('express');
require('./config.js');
require('dotenv').config();
const teacherModel = require('./teacherSchema.js');
const subjectModel = require('./subjectSchema.js')
const deptModel = require('./departmentSchema.js');
const noteModel = require('./notesSchema.js');
const fileUpload = require('express-fileupload');
const cloudinary = require('cloudinary').v2;
const app = express();
const port = 9000;

app.use(fileUpload({
    useTempFiles: true
}));

app.use(express.json());

//cloudinary configure----------------------------------------------------------------------
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_USER_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})
//-----------------------------------------------------------------------------------------

//Get Api--------------------------------------------------------
app.get('/get', async (req, resp) => {
    let data = await teacherModel.find().populate('departments');
    resp.send(data);

});
//---------------------------------------------------------------------------

//Search Api---------------------------------------------------------------
app.get('/search/:key', async (req, resp) => {
    let data = await teacherModel.find(
        {
            "$or": [
                { "name": { $regex: req.params.key } },
                { "subject": { $regex: req.params.key } }
            ]
        }
    )
    resp.send(data);
})
//----------------------------------------------------------------------

//Post Api-----------------------------------------------------------------------
app.post('/insert', async (req, resp) => {
    //figure it out-----------------------------------------------
    const file = req.files.profilepic;
    cloudinary.uploader.upload(file.tempFilePath, async (err, result) => {
        const data = new teacherModel(
            {
                "name": req.body.name,
                "phoneno": req.body.phoneno,
                "gender": req.body.gender,
                "birthdate": req.body.birthdate,
                "department_id": req.body.department_id,
                "email": req.body.email,
                "address": req.body.address,
                "city": req.body.city,
                "state": req.body.state,
                "pincode": req.body.pincode,
                "imagepath": result.url

            })

        const datasave = await data.save();
        resp.status(200).json(datasave);
    });
});

app.get('/get/profile/info',async(req,resp)=>{
    const data=await teacherModel.find({
        "name":"Goku",
    });


    resp.status(200).json({
        "name":data[0].name,
        "department_id":data[0].department_id,
        "imagepath":data[0].imagepath
    });

})
//-----------------------------------------------------------------------------

//Put Api------------------------------------------------------------------------------
app.put('/update/:_id', async (req, resp) => {
    let data = await teacherModel.updateOne(
        req.params,
        { $set: req.body }
    )
    resp.send(data);

});
//-------------------------------------------------------------------------------------



//Delete Api---------------------------------------------------------------------------------------
app.delete('/delete/:_id', async (req, resp) => {
    let data = await teacherModel.deleteOne(req.params);
    resp.send(data);
});
//---------------------------------------------------------------
//Post dept name Api---------------------------------------------
app.post('/insert/dept', async (req, resp) => {
    const data = new deptModel({
        "name": req.body.name
    });
    const result = await data.save();
    resp.status(200).json(result);
})//----------------------------------------------------

//----------------------------------------------------------------------------------------------
//        Subject Api
//----------------------------------------------------------------------------------------------
app.post('/insert/subject', async (req, resp) => {
    const data = new subjectModel({
        "name": req.body.name,
        "teacher_id": req.body.teacher_id,
        "department_id": req.body.department_id
    })
    const result = await data.save();
    resp.status(200).json(result);
});

app.get('/view/subject', async (req, resp) => {
    const data = await subjectModel.find();
    resp.status(200).json(data);
});

app.put('/update/subject/:_id', async (req, resp) => {
    const data = await subjectModel.updateOne(
        req.params,
        { $set: req.body }
    )
    resp.status(200).json(data);
});

app.delete('/delete/subject/:_id', async (req, resp) => {
    const data = await subjectModel.deleteOne(req.params);
    resp.status(200).json(data);
})


//----------------------------------------------------------------------------------------------
//        Notes Api
//----------------------------------------------------------------------------------------------
app.post('/upload/notes', async (req, resp) => {
    const file = req.files.uploadnote;
    cloudinary.uploader.upload(file.tempFilePath, async(error, result) => {
        const data = new noteModel({
            "teacher_id": req.body.teacher_id,
            "subject_id": req.body.subject_id,
            "file_path": result.url

        })
        const dataSaved = await data.save();
        resp.status(200).json(dataSaved);
    })
 
})

//-----------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------



app.listen(port, () => {
    console.log(`Running on port ${port}`);
});
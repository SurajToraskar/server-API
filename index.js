const express = require('express');
const xlsx = require('xlsx');
require('./config.js');
require('dotenv').config();
const teacherModel = require('./teacherSchema.js');
const subjectModel = require('./subjectSchema.js')
const deptModel = require('./departmentSchema.js');
const noteModel = require('./notesSchema.js');
const QpaperModel = require('./QpaperSchema.js')
const assignmentModel = require('./assignmentSchema.js')
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
app.post('/teacher', async (req, resp) => {
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

app.get('/teacher', async (req, resp) => {
    const data = await teacherModel.find({
        "name": "Goku",
    });


    resp.status(200).json({
        "name": data[0].name,
        "department_id": data[0].department_id,
        "imagepath": data[0].imagepath
    });

})
//-----------------------------------------------------------------------------

//Put Api------------------------------------------------------------------------------
app.put('/teacher/:_id', async (req, resp) => {
    let data = await teacherModel.updateOne(
        req.params,
        { $set: req.body }
    )
    resp.send(data);

});
//-------------------------------------------------------------------------------------



//Delete Api---------------------------------------------------------------------------------------
app.delete('/teacher/:_id', async (req, resp) => {
    let data = await teacherModel.deleteOne(req.params);
    resp.send(data);
});
//---------------------------------------------------------------
//Post dept name Api---------------------------------------------
app.post('/dept', async (req, resp) => {
    const data = new deptModel({
        "name": req.body.name
    });
    const result = await data.save();
    resp.status(200).json(result);
})//----------------------------------------------------

//----------------------------------------------------------------------------------------------
//        Subject Api
//----------------------------------------------------------------------------------------------
app.post('/subject', async (req, resp) => {
    const data = new subjectModel({
        "name": req.body.name,
        "teacher_id": req.body.teacher_id,
        "department_id": req.body.department_id
    })
    const result = await data.save();
    resp.status(200).json(result);
});

app.get('/subject', async (req, resp) => {
    const data = await subjectModel.find();
    resp.status(200).json(data);
});

app.put('/subject/:_id', async (req, resp) => {
    const data = await subjectModel.updateOne(
        req.params,
        { $set: req.body }
    )
    resp.status(200).json(data);
});

app.delete('/subject/:_id', async (req, resp) => {
    const data = await subjectModel.deleteOne(req.params);
    resp.status(200).json(data);
})


//========================================================================================================================
//        Notes Api
//========================================================================================================================
app.post('/upload/notes', async (req, resp) => {
    const file = req.files.uploadnote;
    cloudinary.uploader.upload(file.tempFilePath, async (error, result) => {
        const data = new noteModel({
            "teacher_id": req.body.teacher_id,
            "subject_id": req.body.subject_id,
            "file_path": result.url

        })
        console.log(result)
        const dataSaved = await data.save();
        resp.status(200).json(dataSaved);
    })

})

app.delete('/delete/notes/:_id', async (req, resp) => {
    const data = await noteModel.find(req.params);
    const imageUrl = data[0].file_path;
    const urlArray = imageUrl.split('/');
    const image = urlArray[urlArray.length - 1];
    const imageName = image.split('.')[0];

    noteModel.deleteOne(req.params).then(() => {
        cloudinary.uploader.destroy(imageName, (error, result) => {
            resp.send(result);
        }).catch((error) => {
            resp.send(error);
        })
    }).catch((error) => {
        resp.send(error);
    })
})

app.get('/view/notes/:_id', async (req, resp) => {
    const data = await noteModel.find(req.params);
    const imagePath = data[0].file_path;
    resp.send(imagePath);
})

app.put('/update/notes/:_id', async (req, resp) => {
    const data = await noteModel.updateOne(
        req.params._id,
        { $set: req.body }
    )
    resp.send(data);
})

// ======================================================================================================================================

//==================================================================================================================
//    Assignment Api
//==================================================================================================================

app.post('/assignment', async (req, resp) => {
    const file = req.files.uploadassignment;
    cloudinary.uploader.upload(file.tempFilePath, async (error, result) => {
        const data = new assignmentModel({
            "teacher_id": req.body.teacher_id,
            "subject_id": req.body.subject_id,
            "file_path": result.url

        })
        console.log(result)
        const dataSaved = await data.save();
        resp.status(200).json(dataSaved);
    })

})

app.delete('/assignment/:_id', async (req, resp) => {
    const data = await assignmentModel.find(req.params);
    const imageUrl = data[0].file_path;
    const urlArray = imageUrl.split('/');
    const image = urlArray[urlArray.length - 1];
    const imageName = image.split('.')[0];

    assignmentModel.deleteOne(req.params).then(() => {
        cloudinary.uploader.destroy(imageName, (error, result) => {
            resp.send(result);
        }).catch((error) => {
            resp.send(error);
        })
    }).catch((error) => {
        resp.send(error);
    })
})

app.get('/assignment/:_id', async (req, resp) => {
    const data = await assignmentModel.find(req.params);
    const imagePath = data[0].file_path;
    resp.send(imagePath);
})

app.put('/assignment/:_id', async (req, resp) => {
    const data = await assignmentModel.updateOne(
        req.params._id,
        { $set: req.body }
    )
    resp.send(data);
})
//=======================================================================================================================


//=======================================================================================================================
// Question Api
//=======================================================================================================================
app.post('/qpaper', async (req, resp) => {
    const file = req.files.uploadqpaper;
    cloudinary.uploader.upload(file.tempFilePath, async (error, result) => {
        const data = new QpaperModel({
            "teacher_id": req.body.teacher_id,
            "subject_id": req.body.subject_id,
            "file_path": result.url

        })
        console.log(result);
        const dataSaved = await data.save();
        resp.status(200).json(dataSaved);
    })

})


app.delete('/qpaper/:_id', async (req, resp) => {
    const data = await QpaperModel.find(req.params);
    const imageUrl = data[0].file_path;
    const urlArray = imageUrl.split('/');
    const image = urlArray[urlArray.length - 1];
    const imageName = image.split('.')[0];

    QpaperModel.deleteOne(req.params).then(() => {
        cloudinary.uploader.destroy(imageName, (error, result) => {
            resp.send(result);
        }).catch((error) => {
            resp.send(error);
        })
    }).catch((error) => {
        resp.send(error);
    })
})

app.get('/qpaper/:_id', async (req, resp) => {
    const data = await QpaperModel.find(req.params);
    const imagePath = data[0].file_path;
    resp.send(imagePath);
})

//--------------On hold---------------------------
// app.put('/update/qpaper/:_id', async (req, resp) => {
//     const data = await QpaperModel.find(req.params);
//     const imageUrl = data[0].file_path;
//     const teacher_id = data[0].teacher_id;
//     const subject_id = data[0].subject_id;
//     const urlArray = imageUrl.split('/');
//     const image = urlArray[urlArray.length - 1];
//     const imageName = image.split('.')[0];
//     cloudinary.uploader.destroy(imageName, (error, result) => {
//         resp.send(result);
//     }).catch((error) => {
//         resp.send(error);
//     })
//     const file = req.files.uploadqpaper;
//     cloudinary.uploader.upload(file.tempFilePath, async (error, result) => {
//         const data = new QpaperModel({
//             "teacher_id": teacher_id,
//             "subject_id": subject_id,
//             "file_path": result.url

//         })
//         console.log(result)
//         const dataSaved = await data.save();
//         resp.status(200).json(dataSaved);
//     })

// })

//=============================================================================================

//Excel file
// const workbook = xlsx.readFile('Book1.xlsx');
// const sheet = workbook.Sheets['Sheet1'];
// let data = xlsx.utils.sheet_to_json(sheet);
// // console.log(data);
// let keys=Object.keys(data[0]);
// console.log(keys);

// data.forEach(calAvg)
// data.forEach(print);

// function calAvg(element, index, array) {

//     array[index] = (element.maths +element.chemistry + element.physics) + "%";
 
// }

// function print(element)
// {
//     console.log(element);
// }




















//-----------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------



app.listen(port, () => {
    console.log(`Running on port ${port}`);
});
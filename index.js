const express=require('express');
require('./config.js');
const model=require('./schema.js')
const app=express();

app.use(express.json());

app.get('/get',async (req,resp)=>{
    let data=await model.find();
    resp.send(data);
   
});

app.get('/search/:key',async (req,resp)=>{
    let data=await model.find(
        {
            "$or":[
                {"name":{$regex:req.params.key}},
                {"genre":{$regex:req.params.key}}
            ]
        }
    )
    resp.send(data);
})

app.post('/insert',async (req,resp)=>{
     let data=new model(req.body)
     let result=await data.save();
     resp.send(result);
});


app.put('/update/:_id',async (req,resp)=>{
    let data=await model.updateOne(
        req.params,
        {$set:req.body}
         )
    resp.send(data);

});


app.delete('/delete/:_id',async (req,resp)=>{
    let data=await model.deleteOne(req.params);
    resp.send(data);
});

app.listen(9000);
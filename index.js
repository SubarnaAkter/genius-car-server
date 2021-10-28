const express=require('express');
const { MongoClient } = require('mongodb');
const ObjectId=require("mongodb").ObjectId;

const cors=require('cors')
require('dotenv').config();
const app=express();
const port=process.env.PORT || 5000;
//middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vithd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
    
        await client.connect();
         const database=client.db("carMechanics");
         const servicesCollection=database.collection("services");

           //add

           app.get("/services",async (req,res)=>{
             const cursor=servicesCollection.find({});
             const result=await cursor.toArray();
           
             res.send(result)
         });
         //

         app.get("/services/:id",async (req,res)=>{

            const id=req.params.id;
            const query={_id:ObjectId(id)}
            const result= await servicesCollection.findOne(query);
            
            res.json(result)
        })
           //post 
         app.post("/services",async (req,res)=>{
            const service=req.body;
             const result=await servicesCollection.insertOne(service);
             res.json(result)
         })

         //delete

         app.delete("/services/:id",async(req,res)=>{
               const id=req.params.id;
               const query={_id:ObjectId(id)};
               const result=await servicesCollection.deleteOne(query);
               res.json(result);
         })
    }
    finally{
        //  await client.close()
    }
}
run().catch(console.dir)

app.get('/',(req,res)=>{
    res.send("Genius cart running")
})
app.get('/hello',(req,res)=>{
    res.send("Hello updated")
})

app.listen(port,()=>{
    console.log('Listening at ' ,port)
})
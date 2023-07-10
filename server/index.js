import  Express  from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt"

import cors from "cors"
const app=Express()
mongoose.connect("mongodb://localhost:27017/ahmed")
.then("conncected to mongoose")
.catch((err)=>console.log(err))
const userSchema= mongoose.Schema({
    email:{
        type:String,
        unique:true
    },
    age:{
        type:Number,
        maxlength:3,
        minlength:1
    },
    name:String,
    mobile:{
        // minlength:10,
        // maxlength:10,
        type:Number
    },
    password:{
        required:true,
        type:String
    }
})
userSchema.pre("save",async function(next){
    if(this.isModified("password")){
        this.password= await bcrypt.hash(this.password,12)
    }
    next()
})

const xtra=mongoose.model("onein",userSchema)
const sc1=mongoose.Schema({
    r1:Object,
    r2:Object,
    ticket:String
    })
const mo1=mongoose.model("react",sc1)

app.use(Express.json())
app.use(cors())
app.post("/api",async(req,res)=>{
  const data= await new xtra({
      email:req.body.email,
      age:req.body.age,
      password:req.body.password,
      mobile:req.body.mobile,
      name:req.body.name
    })
  data.save()
    .then(() => {
        res.status(200).json({message:"createduser"})
      })
      .catch((err) => {
       res.status(500).json({message:err});
      })
})
app.get("/login",pagination(mo1),async(req,res)=>{
      res.json(res.pagination)
    })
    // ----------------------------
 app.get("/exp",async(req,res)=>{
    const x=await xtra.find({})
    res.json(x)
 })
    app.post("/exp", async(req, res) => {
        const{email,password}=req.body
        console.log(req.body,"this is body")
        const result = await xtra.findOne({email})
        console.log(result,"this is result"); // Add this line
        const ism = await bcrypt.compare(password, result.password);        
        if(ism){
            res.json({message:"sent"})
        }
        else{
            res.json({message:"invalid credentials"})
        }
       
      })

  
      

    function pagination(mo1){
        return async(req,res,next)=>{
            const x= await mo1.find({})
            const page=parseInt(req.query.page)
            const limit=parseInt(req.query.limit)
            const total=await mo1.countDocuments({})
            const startIndex=(page-1)*limit
            const endIndex=page*limit
            const result={}
            if(endIndex<x.length){
                result.next={
                    page:page+1,
                    limit:limit
                } 
            }
           if(startIndex>0){
            result.prev={
                page:page-1,
                limit:limit
            }
           }
             result.result=x.slice(startIndex,endIndex)
             result.totalPages=total
           
         
          res.pagination=result
          
          
          next()
        }
    }
   

app.listen(4000,()=>console.log("server started on port 4000"))
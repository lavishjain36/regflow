//import express,cors,mongoose
import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";

import mongoose from 'mongoose';//high level abstraction
dotenv.config();
const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;

//instance of express app
const app=express();
// const PORT=9002;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());//middleware->parse url-encoded data 
// in submitting in req. body


mongoose.connect(
    MONGO_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    },()=>{
        console.log("MongoDb DB Connected Successfully");
    }
);
//Create Mongoose Schema for the User Model
const userSchema=new mongoose.Schema({
    name:String,
    email:String,
    password:String
})


//create Mongoose model for User collection based on Schema
const User=new mongoose.model("User",userSchema);
app.get("/",(req,res)=>{
    res.send("Hello.Welcome to Registration and Login Backend");
})


//creat a route for Login based on User

app.post("/login",(req,res)=>{
    const {email,password}=req.body;

    User.findOne({email:email},(err,user)=>{
        if(user){
            if(password===user.password){
                res.send({message:"Login Successful",user:user})
            }else{
                res.send({message:"Password is not matched..."})
            }
        }else{
            res.send({message:"User is not Found."})
        }
    })
})

//Create a Route for Registration 
app.post('/register',(req,res)=>{
    const {name,email,password}=req.body;
    
    User.findOne({email:email},(err,user)=>{
        if(user){
            res.send({message:"User Already Registered"});
        }else{
                //create a new User instance object with 3 details
            const user=new User({
                name:name,
                email:email,
                password:password
            })

            user.save((err)=>{
                if(err){
                    res.send(err);
                }else{
                    res.send({message:"User Registered Successfully"});
                }
            })

        }
    })






})

app.listen(PORT,()=>{
    console.log("App Started on Port "+ PORT);
})
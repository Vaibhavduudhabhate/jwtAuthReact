import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import studentModel from "./model/studentModel.js"

const app = express();
app.use(express.json())
app.use(cors());


async function connectMongoDb(url){
    return mongoose.connect(url)
}
connectMongoDb('mongodb+srv://admin:admin1234@cluster0.w3huoar.mongodb.net/practiceDatabase').then(()=>console.log("mongodb connected"))

export default{
    connectMongoDb,
}

app.post('/register',(req,res)=>{
    const {name,email,password} = req.body;
    studentModel.create({name,email,password})
    .then(user=>res.json(user))
    .catch(err => res.json(err))
})

app.listen(3001 ,()=>{
    console.log("server is running");
})
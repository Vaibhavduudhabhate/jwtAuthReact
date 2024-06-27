import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import studentModel from "./model/studentModel.js"

const app = express();
app.use(cookieParser())
app.use(express.json())
app.use(cors(
    {
        origin:['http://localhost:5173'],
        credentials:true
    }
));


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

app.post('/login',(req,res)=>{
    const {email,password} = req.body;
    studentModel.findOne({email,password})
    .then(user =>{
        if(user){
            if(user.password === password){
                const accessToken = jwt.sign({email : email},
                    'jwt-access-token-secret-key',{expiresIn:'1m'});
                const refreshToken = jwt.sign({email : email},
                    'jwt-refresh-token-secret-key',{expiresIn:'5m'});    
                res.cookie('accessToken',accessToken ,{maxAge:60000});
                res.cookie('refreshToken',refreshToken ,
                    {maxAge:30000,httpOnly:true,secure:true,sameSite:'strict'})
                return res.json({Login : true})

            }
        }else{
            res.json({Login : false,Message:'no record found'})    
        }
    })
    .catch(err => res.json(err))
})

const verifyuser = (req,res,next) =>{
    const accessToken = req.cookies.accessToken;
    if(!accessToken){
        if(renewToken(req,res)){
            next()
        }
    }else{
        jwt.verify(accessToken,'jwt-access-token-secret-key',(err,decoded)=>{
            if(err){
                return res.json({valid:false,message:'Invalid Token'})
            }else{
                req.email = decoded.email
                next()
            }
        })
    }
}

const renewToken = (req,res) =>{
    const refreshToken = req.cookies.refreshToken;
    let exit = false
    if(!refreshToken){
        return res.json({valid:false,message:"no refresh token"})
    }else{
        jwt.verify(refreshToken,'jwt-refresh-token-secret-key',(err,decoded)=>{
            if(err){
                return res.json({valid:false,message:'Invalid refresh Token'})
            }else{
                const accessToken = jwt.sign({email : decoded.email},
                    'jwt-access-token-secret-key',{expiresIn:'1m'});
                res.cookie('accessToken',accessToken ,{maxAge:60000});
                    exit = true;
            }
        })
    }
    return exit;
}

app.get('/dashboard',verifyuser,(req,res)=>{
    return res.json({valid:true,message:"authorized"})
})

app.listen(3001 ,()=>{
    console.log("server is running");
})
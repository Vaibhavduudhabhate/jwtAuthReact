import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import studentModel from "./model/studentModel.js"
import productModel from "./model/productModel.js";
import nodemailer from 'nodemailer';
import multer from "multer";
import fs from "fs";
import path from "path";
// import crypto, { verify } from 'crypto';
// import bcrypt from 'bcrypt';

const jwt_secret = 'jsknkjfdkjshdkfjhs'

const app = express();
app.use(cookieParser())
app.use(express.json())
app.set("view engine",'ejs')
app.use(express.urlencoded({extended:false}));
app.use('/uploads', express.static('uploads'));
app.use(cors(
    {
        origin:['http://localhost:5173'],
        credentials:true
    }
));

// const upload = multer({dest:"uploads/"})
const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });
  
  const upload = multer({
    storage:storage
    // ,
    // limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB size limit
    // fileFilter: (req, file, cb) => {
    //   const filetypes = /jpeg|jpg|png|gif/;
    //   const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    //   const mimetype = filetypes.test(file.mimetype);
  
    //   if (mimetype && extname) {
    //     return cb(null, true);
    //   } else {
    //     return cb(new Error('Invalid file type. Only images are allowed.'));
    //   }
    // },
  });
  

app.post('/forgotPassword',async(req,res)=>{
    const email = req.body.email;
    // console.log(req.body.email ,email)
    try {
        const olduser = await studentModel.findOne({email});
        console.log(olduser)
        if(!olduser){
            return res.json({status:"user not exists"})
        }
        const secret = jwt_secret + olduser.password;
        const token = jwt.sign({email : olduser.email ,id:olduser._id},secret,{expiresIn : '5m'});
        const link = `http://localhost:3002/resetPassword/${olduser._id}/${token}`;
        console.log('link',link)
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'dudhabhatevaibhav@gmail.com',
              pass: 'uhmidniafrsfspqj'
            }
          });
          
          var mailOptions = {
            from: emailUser,
            to:email,
            subject: 'Sending Email using Node.js',
            // text: `${link}`,
            html: `<p>Click this Link  <a href="${link}">here to forgot password </a> to visit the link.</p>`,
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
        res.send(link)
    } catch (error) {
        console.log(error)
    }
})

app.get("/resetPassword/:id/:token",async(req,res)=>{
    const {id,token} = req.params;
    // console.log(req.params);
    const olduser = await studentModel.findOne({_id : id});
        console.log(olduser)
        if(!olduser){
            return res.json({status:"user not exists"})
        }
        const secret = jwt_secret + olduser.password;
        try {
            const verify = jwt.verify(token,secret)
            res.render('index',{email:verify.email,status:'Not verified'})
            // res.send("verified")
        } catch (error) {
            console.log(error)
            res.send('not Verified')
        }
})
app.post("/resetPassword/:id/:token", async (req, res) => {
    const { id, token } = req.params;
    const { password } = req.body;

    try {
        const oldUser = await studentModel.findOne({ _id: id });
        if (!oldUser) {
            return res.status(404).json({ status: "user not found" });
        }
        const secret = jwt_secret + oldUser.password;
        jwt.verify(token, secret, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ status: "token verification failed" });
            }

            await studentModel.updateOne(
                { _id: id },
                { $set: { password: password } }  
            );

            res.render("index",{ email:verify.email,status:'verified'})
        });
    } catch (error) {
        console.error("Error resetting password:", error);
        res.status(500).send("Internal Server Error");
    }
});


//   app.post('/forgot-password', (req, res) => {
//     const { email } = req.body;
  
//     // Generate a unique reset token
//     const resetToken = crypto.randomBytes(20).toString('hex');
    
//     // Save the token to the user's document in the database
//     studentModel.findOneAndUpdate(
//       { email },
//       { resetToken, resetTokenExpiry: Date.now() + 3600000 }, // Token expires in 1 hour
//       { new: true }
//     ).then(user => {
//       if (!user) {
//         return res.status(404).json({ message: 'User not found' });
//       }
  
//       // Send email with password reset link
//       const resetLink = `http://localhost:3002/reset-password/${resetToken}`;
//       const mailOptions = {
//         from: 'dudhabhatevaibhav@gmail.com',
//         to: email,
//         subject: 'Password Reset Link',
//         text: `Click on this link to reset your password: ${resetLink}`
//       };
  
//       transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//           console.log(error);
//           return res.status(500).json({ message: 'Failed to send email' });
//         }
//         console.log('Email sent: ' + info.response);
//         res.json({ message: 'Password reset link sent to your email' });
//       });
//     }).catch(err => res.status(500).json(err));
//   });
  

//   app.post('/reset-password/:token', (req, res) => {
//     const { token } = req.params;
//     const { newPassword } = req.body;
  
//     studentModel.findOneAndUpdate(
//       { resetToken: token, resetTokenExpiry: { $gt: Date.now() } },
//       { password: newPassword, resetToken: null, resetTokenExpiry: null },
//       { new: true }
//     ).then(user => {
//       if (!user) {
//         return res.status(400).json({ message: 'Invalid or expired token' });
//       }
//       res.json({ message: 'Password reset successfully' });
//     }).catch(err => res.status(500).json(err));
//   });

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
                res.cookie('accessToken',accessToken ,{ maxAge: 60000, httpOnly: true, secure: false, sameSite: 'Strict' });
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

const verifyuser = async(req,res,next) =>{
    console.log(req.cookies)
    const accessToken = req.cookies.accessToken;
    console.log(accessToken)
    if(!accessToken){
        try {
            await renewToken(req, res);
            return next();
        } catch (error) {
            return res.json(error);
        }
    }else{
        jwt.verify(accessToken,'jwt-access-token-secret-key',(err,decoded)=>{
            if(err){
                return res.json({valid:false,message:'Invalid Token'})
            }else{
                req.email = decoded.email;
                return next();
            }
        })
    }
}

// const renewToken = (req,res) =>{
//     const refreshToken = req.cookies.refreshToken;
//     console.log("refreshToken",refreshToken)
//     let exit = false
//     if(!refreshToken){
//         return res.json({valid:false,message:"no refresh token"})
//     }else{
//         jwt.verify(refreshToken,'jwt-refresh-token-secret-key',(err,decoded)=>{
//             if(err){
//                 return res.json({valid:false,message:'Invalid refresh Token'})
//             }else{
//                 const accessToken = jwt.sign({email : decoded.email},
//                     'jwt-access-token-secret-key',{expiresIn:'1m'});
//                 res.cookie('accessToken',accessToken ,{maxAge:60000});
//                     exit = true;
//             }
//         })
//     }
//     return exit;
// }

const renewToken = (req, res) => {
    return new Promise((resolve, reject) => {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return reject({ valid: false, message: "no refresh token" });
        }
        jwt.verify(refreshToken, 'jwt-refresh-token-secret-key', (err, decoded) => {
            if (err) {
                return reject({ valid: false, message: 'Invalid refresh Token' });
            } else {
                const accessToken = jwt.sign({ email: decoded.email }, 'jwt-access-token-secret-key', { expiresIn: '1m' });
                res.cookie('accessToken', accessToken, { maxAge: 60000, httpOnly: true, secure: false, sameSite: 'Strict' });
                return resolve(true);
            }
        });
    });
};

app.get('/dashboard',verifyuser,(req,res)=>{
    return res.json({valid:true,message:"authorized"})
})
app.get('/allproducts', async (req, res) => {
    const assetsPath = path.resolve('uploads');

    try {
        const products = await productModel.find({});
        const productsWithImages = await Promise.all(products.map(async product => {
            const imagePath = path.join(assetsPath, product.image.replace('/uploads/', ''));
            let image = '';

            try {
                const imageBuffer = await fs.promises.readFile(imagePath);
                image = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;
            } catch (error) {
                console.error('Error reading image:', error);
            }
            return {
                ...product.toObject(),
                image: image
            };
        }));

        res.json(productsWithImages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


    // app.get('/allproducts',verifyuser, (req, res) => {
    //     const assetsPath = path.resolve('uploads');

    //     productModel.find({})
    //         .then(products => {
    //             const productsWithImages = products.map(product => {
    //                 const imagePath = path.join(assetsPath, product.image.replace('/uploads/', '')); 
    //                 let image = '';

    //                 try {
    //                     const imageBuffer = fs.readFileSync(imagePath); 
    //                     image = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;  
    //                 } catch (error) {
    //                     console.error('Error reading image:', error);
    //                 }
    //                 return {
    //                     ...product.toObject(),
    //                     image: image  
    //                 };
    //             });

    //             res.json(productsWithImages);
                
    //         })
    //         .catch(err => res.status(500).json({ error: err.message }));
    // });
    app.get('/view/:id', (req, res) => {
        const id = req.params.id;
    
        // Check if the ID is valid
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }
    
        productModel.findById(id)
            .then(product => {
                if (!product) {
                    return res.status(404).json({ message: "Product not found" });
                }
                
                // Get the image path
                const assetsPath = path.resolve('uploads');
                const imagePath = path.join(assetsPath, product.image.replace('/uploads/', ''));
                let image = '';
    
                try {
                    const imageBuffer = fs.readFileSync(imagePath);
                    image = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;
                } catch (error) {
                    console.error('Error reading image:', error);
                }
    
                // Return product with image as Base64
                res.json({
                    ...product.toObject(),
                    image: image
                });
            })
            .catch(err => res.status(500).json({ error: err.message }));
    });
    

    app.post('/imagewithadd',upload.single("image"),async(req,res)=>{
            console.log(req.body)
            const {userName,description} = req.body;
        const imagePath = req.file.filename;
        // const image = req.file ? `/uploads/${req.file.filename}` : ''; 
        productModel.create({userName,description,image:imagePath})
        .then(user=>res.json(user))
        .catch(err => res.json(err))
    })

    app.delete('/delete/:id', (req, res) => {
        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }
    
        productModel.findByIdAndDelete(id)
            .then(result => {
                if (!result) {
                    return res.status(404).json({ message: "Product not found" });
                }
                res.json({ message: "Product deleted successfully" });
            })
            .catch(err => res.status(500).json({ error: err.message }));
    });
    
    app.put('/update/:id', upload.single('image'), (req, res) => {
        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }
    
        const { userName, description } = req.body;
        const updateData = { userName, description };
    
        if (req.file) {
            updateData.image = req.file.filename;
        }
    
        productModel.findByIdAndUpdate(id, updateData, { new: true })
            .then(updatedProduct => {
                if (!updatedProduct) {
                    return res.status(404).json({ message: "Product not found" });
                }
                res.json(updatedProduct);
            })
            .catch(err => res.status(500).json({ error: err.message }));
    });

async function connectMongoDb(url){
    return mongoose.connect(url)
}
connectMongoDb('mongodb+srv://admin:admin1234@cluster0.w3huoar.mongodb.net/practiceDatabase').then(()=>console.log("mongodb connected"))

export default{
    connectMongoDb,
}

app.listen('3002' ,()=>{
    console.log(`server is running on port3002 `);
})
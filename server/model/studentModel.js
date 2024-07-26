import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type :String,
        // required : true
    },
    email :{
        type : String,
        required : [true,'Please Enter an email'],
        unique:true,
        lowercase:true,
        // validate:[isEmail,'Please Enter a valid email']
    },
    password :{
        type : String,
        required : [true,'Please Enter an Password'],
        minLength:[6,'minimum password length should be 6 charecters']
    },
},{timestamps :true})

const studentModel = mongoose.model('register',userSchema)
export default studentModel
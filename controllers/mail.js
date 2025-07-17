require('dotenv').config()
let express=require("express");
let router=express.Router();
let hbs=require("hbs");
let mongoose=require("mongoose");
let multer=require("multer");
let cloudinary=require("cloudinary");
var nodemailer=require("nodemailer");
function sendmailtosub(){
var transporter=nodemailer.createTransport({
  service:'gmail',
  auth:{
    user:'shashankspandey04@gmail.com',
    pass:process.env.mail_pass
  }
})
var mailOptions={
  from:'shashankspandey04@gmail.com',
  to:req.body.mail,
  subject:'sending u a msg after a long time',
  text:'hi buddy how r u ?'
}
transporter.sendMail(mailOptions,(err,res)=>{
  if(err){
    console.log(err);
  }else{
    console.log(`mail sent`)
  }
})
}
module.exports=sendmailtosub;

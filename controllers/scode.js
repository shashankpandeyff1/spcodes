require('dotenv').config()
let express=require("express");
let router=express.Router();
let hbs=require("hbs");
let mongoose=require("mongoose");
var nodemailer=require("nodemailer");
let multer=require("multer");
let cloudinary=require("cloudinary");
let ABOUT=require("../models/abt");
let TECH=require("../models/tech");
let PROJECT=require("../models/project");
let POST=require("../models/post");
let CONTACT=require("../models/inquiry");
let CDET=require("../models/condetails");
let SUBS=require("../models/subs");
let STAT=require("../models/stat");
let MAILLOG=require("../models/maillog");

let scode=async(req,res)=>{
  try{
    let mail=req.body.mail;
    await PROJECT.findByIdAndUpdate(req.params.id,{
      $push:{users:req.body.mail}
    },{$upsert:true})
    let fp=await PROJECT.findById(req.params.id);
    let transporter=nodemailer.createTransport({
      service:'gmail',
      auth:{
        user:'shashankspandey04@gmail.com',
        pass:process.env.mail_pass
      }
    })
    let mailOptions={
      from:'shashankspandey04@gmail.com',
      to:`${mail}`,
      subject:`want ${fp.title}'s source code ?`,
      text: `Request for ${fp.title}'s source code received !`
    }
    transporter.sendMail(mailOptions,(err,res)=>{
      if(err){
        console.log(err)
      }else{
        console.log("mail sent");
      }
    })
    let date= new Date();
    let day=date.getDate();let month=date.getMonth()+1;let year=date.getFullYear();
    let md=`${day}-${month}-${year}`;
    console.log(md)
    let mt=`${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    console.log(mt)
    let maillog=new MAILLOG({
      from:mailOptions.from,
      to:mailOptions.to,
      subject:mailOptions.subject,
      text:mailOptions.text,
      doc:`date:${md},time:${mt}`,
    })
    let saveml=await maillog.save();
    res.render("msg",{
      msg:"request sent"
    })
  }catch(e){
    res.render("msg",{
      msg:e
    })
    console.log(e)
  }
}
module.exports=scode;

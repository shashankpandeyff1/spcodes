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
let unsubscribe=async(req,res)=>{
  try{
    let mail=req.body.mail;
    let cond=await CDET.find().sort({'_id':-1}).limit(1);
    let validemail=await SUBS.findOne({mail:mail});
    let otp=  Math.floor(100000 + Math.random() * 900000)
    if(validemail){
      console.log(otp);
      req.session.otp=otp;
      req.session.mailid=mail;
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
        subject:`use this OTP ${otp} to unsubscribe from shashankpandey's site`,
        text:`YOUR OTP:${otp}`
      }
    //  await new Promise((resolve,reject)=>{
      transporter.sendMail(mailOptions,(err,res)=>{
        if(err){
          console.log(err);
         //reject(err);
        }else{
        /*  resolve(res).then((data)=>{
            res.render("users/unsubscribe",{
              cond:cond,
            })
          });*/
          console.log(`mail sent`)
        }
      })
   //})
      let date= new Date();
      let day=date.getDate();let month=date.getMonth()+1;let year=date.getFullYear();
      let md=`${day}-${month}-${year}`;
    //  console.log(md)
      let mt=`${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
      console.log(mt)
      let maillog=new MAILLOG({
        from:mailOptions.from,
        to:`${mail}`,
        subject:mailOptions.subject,
        text:mailOptions.text,
        doc:`date:${md},time:${mt}`,
      })
      let saveml=await maillog.save();
      res.render("users/unsubscribe",{
        cond:cond,
      })
    }else{
      res.render("msg",{
        msg:"enter valid email*",
      //  cond:cond,
      })
    }
    //console.log("unsubscribed")
  }catch(e){
    let cond=await CDET.find().sort({'_id':-1}).limit(1);
    res.render("msg",{
      msg:e,//cond:cond,
    })
    console.log(e)
  }
}
let otpvalid=async(req,res)=>{
let cond=await CDET.find().sort({'_id':-1});
  try{
    let session=req.session;
    let otp=session.otp;
    let mail=session.mailid;
    let userotp=req.body.otp;
    if(userotp==otp){
    await SUBS.deleteOne({mail:mail});
    res.render("msg",{
      msg:'unsubscribed.Now you will not receive any mail from this site.',//cond:cond,
    })
  }else{
    res.render("msg",{
      msg:'unsubscription failed*',//cond:cond,
    })
  }
  }catch(e){
    res.render("msg",{
      msg:e,//cond:cond,
    })
    console.log(e);
  }
}
module.exports={unsubscribe,otpvalid};

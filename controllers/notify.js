require('dotenv').config()
let mongoose=require("mongoose");
var nodemailer=require("nodemailer");
let ABOUT=require("../models/abt");
let TECH=require("../models/tech");
let PROJECT=require("../models/project");
let POST=require("../models/post");
let CONTACT=require("../models/inquiry");
let CDET=require("../models/condetails");
let SUBS=require("../models/subs");
let STAT=require("../models/stat");
let MAILLOG=require("../models/maillog");
const { ObjectId } = mongoose.Types;
let notify=async(req,res)=>{
  try{
    let session=req.session;
    let postinfo=session.postinfo;
    let allsubs=[];
        let subs=await SUBS.find({},{_id:0,mail:1});
        subs.map((data)=>{
            allsubs.push(data.toString())
        })
        var transporter=nodemailer.createTransport({
          service:'gmail',
          auth:{
            user:'shashankspandey04@gmail.com',
            pass:process.env.mail_pass
          }
        })
        var mailOptions={
          from:'shashankspandey04@gmail.com',
          to:allsubs,
          subject:`Shashank Pandey's new Blog Post`,
          text:`Post title:${postinfo.title}.Published on ${postinfo.doc}.Visit Shashank Pandey's site to check new blog post. codershashank.onrender.com`
        }
        transporter.sendMail(mailOptions,(err,res)=>{
          if(err){
            console.log(err);
          }else{
            console.log(`mail sent`)
          }
        })
        console.log(req.body.url)
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
        let postid=new ObjectId(postinfo._id);
        await POST.updateOne({_id:postid},{$set:{show:true}},{$upsert:true});
        res.render("msg",{
          msg:'notified all subscribers !!'
        })
  }catch(e){
    res.render("msg",{
      msg:'failed to notify all subscribers*'
    })
     console.log(e);
  }
}
let uploadDraft=async(req,res)=>{
  try{
    let session=req.session;
    let pid=req.params.id;
    let post=await POST.findOne({_id:pid});
    let allsubs=[];
        let subs=await SUBS.find({},{_id:0,mail:1});
        subs.map((data)=>{
            allsubs.push(data.toString())
        })
        var transporter=nodemailer.createTransport({
          service:'gmail',
          auth:{
            user:'shashankspandey04@gmail.com',
            pass:process.env.mail_pass
          }
        })
        var mailOptions={
          from:'shashankspandey04@gmail.com',
          to:allsubs,
          subject:`Shashank Pandey's new Blog Post`,
          text:`Post title:${post.title}.Published on ${post.doc}.Visit Shashank Pandey's site to check new blog post. codershashank.onrender.com`
        }
        transporter.sendMail(mailOptions,(err,res)=>{
          if(err){
            console.log(err);
          }else{
            console.log(`mail sent`)
          }
        })
        console.log(req.body.url)
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
        let postid=new ObjectId(pid);
        await POST.updateOne({_id:pid},{$set:{show:true}},{$upsert:true});
        res.render("msg",{
          msg:'notified all subscribers !!'
        })
  }catch(e){
    res.render("msg",{
      msg:'failed to notify all subscribers*'
    })
     console.log(e);
  }
}
module.exports = {notify,uploadDraft};

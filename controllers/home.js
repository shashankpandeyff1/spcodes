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
let KEYWORD=require("../models/keywords");
let showHomePage=async(req,res)=>{
  try{
    let hitcount=await STAT.findOne({msg:"all stats"});
    if(hitcount.views==undefined){
      count++;
      await STAT.updateMany({_id:hitcount.id},{$set:{views:count}},{$upsert:true});
    }else{
      let views=hitcount.views;
      views++;
      await STAT.updateMany({_id:hitcount.id},{$set:{views:views}},{$upsert:true});
    }
    let count=1;
    let likes=[];
    let abt=await ABOUT.find().sort({'_id':-1}).limit(1);
    let techs=await TECH.find().sort({'_id':-1});
    let projects=await PROJECT.find().sort({'_id':-1});
    let posts=await POST.find({show:true}).sort({'_id':-1});
    let cond=await CDET.find().sort({'_id':-1}).limit(1);
    let procount=await PROJECT.find().count();
    let postcount=await POST.find().count();
    let like=await STAT.find({msg:"all stats"});
    let subscount=await SUBS.find().count();
    let subs=await SUBS.find({},{_id:0,mail:1});
    let allsubs=[];
    subs.map((data)=>{
      allsubs.push(data.toString())
    })
    let bKW=await KEYWORD.find({cat:'portfolio'});
    //console.log(allsubs)
    res.render("users/index",{
      abt:abt,
      techs:techs,
      projects:projects,
      posts:posts,
      cond:cond,
      procount:procount,
      postcount:postcount,
      likecount:hitcount.likes,
      views:hitcount.views,
      like:like,
      subs:subscount,
      keywords:bKW,
    });
  }catch(e){
    res.render("msg",{
      msg:`failed to load the application(shashank pandey's portfolio,try again`
    })
    console.log(e)
  }
}
let likeapp=async(req,res)=>{
  try{
    let likes=await STAT.findOne({msg:"all stats"});
    let count=1;
    if(likes.likes==undefined){
      count++;
      await STAT.updateMany({_id:likes.id},{$set:{likes:count}},{$upsert:true});
    }else{
      let lc=likes.likes;
      lc++;
      await STAT.updateMany({_id:likes.id},{$set:{likes:lc}},{$upsert:true});
    }

    let abt=await ABOUT.find().sort({'_id':-1}).limit(1);
    let techs=await TECH.find().sort({'_id':-1});
    let projects=await PROJECT.find().sort({'_id':-1});
    let posts=await POST.find({show:true}).sort({'_id':-1});
    let cond=await CDET.find().sort({'_id':-1}).limit(1);
    let procount=await PROJECT.find().count();
    let postcount=await POST.find().count();
    let hitcount=await STAT.findOne({msg:"all stats"});
    let like=await STAT.find({msg:"all stats"});
    let subscount=await SUBS.find().count();
    res.render("users/index",{
      abt:abt,
      techs:techs,
      projects:projects,
      posts:posts,
      cond:cond,
      procount:procount,
      postcount:postcount,
      likecount:hitcount.likes,
      views:hitcount.views,
      like:like,
      subs:subscount,
    });
  }catch(e){
    res.render("msg",{
      msg:e
    })
    console.log(e);
  }
}
module.exports={showHomePage,likeapp};

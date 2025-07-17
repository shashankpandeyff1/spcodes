require('dotenv').config()
let POST=require("../models/post");
let CDET=require("../models/condetails");
let PROJECT=require("../models/project");
let KEYWORD=require("../models/keywords");
let mongoose=require("mongoose");
let allposts=async(req,res)=>{
  try{
    let posts=await POST.find({show:true}).sort({'_id':-1});
    let pc=await POST.find({show:true}).count();
    let cond=await CDET.find().sort({'_id':-1}).limit(1);
    let bKW=await KEYWORD.find({cat:'blogs'});
    res.render("users/allposts",{
      posts:posts,
      pc:pc,
      cond:cond,
      keywords:bKW,
    })
  }catch(e){
    res.render("msg",{
      msg:e
    })
    console.log(e);
  }
}
let allprojects=async(req,res)=>{
  try{
    let project=await PROJECT.find().sort({'_id':-1});
    let pc=await PROJECT.find().count();
    let cond=await CDET.find().sort({'_id':-1}).limit(1);
    let bKW=await KEYWORD.find({cat:'portfolio'});
    res.render("users/allprojects",{
      projects:project,
      pc:pc,
      cond:cond,
      keywords:bKW,
    })
  }catch(e){
    res.render("msg",{
      msg:e
    })
    console.log(e);
  }
}
module.exports={allposts,allprojects};

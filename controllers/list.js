let express=require("express");
let router=express.Router();
let hbs=require("hbs");
let mongoose=require("mongoose");
var nodemailer=require("nodemailer");
let multer=require("multer");
let cloudinary=require("cloudinary");
let POST=require("../models/post");
const { ObjectId } = mongoose.Types;
let plist=async(req,res)=>{
  try{
    let id=req.body.id;
    let list=req.body.list;
    await POST.findByIdAndUpdate(id,{
      $push:{lists:{list:req.body.list}}
    },{$upsert:true})
    res.render("msg",{
      msg:"new point added!!"
    })
  }catch(e){
    res.render("msg",{
      msg:"failed to add list point*"
    })
    console.log(e)
  }
}
let lp=async(req,res)=>{
  try{
    req.session.postid=req.params.id;
    await POST.findById(req.params.id).then((data)=>{
      res.render("admin/lpoint",{
        list:data.lists,
      })
      console.log(data.lists)
    })
  }catch(e){
    res.render("msg",{
      msg:'failed to load points*'
    })
    console.log(e);
  }
}
let dltlist=async(req,res)=>{
  try{
    let session=req.session;
    let postid=new ObjectId(session.postid);
    await POST.findByIdAndUpdate(postid,{
      $pull:{lists:{_id:req.params.id}}
    },{ safe: true, multi:true })
    res.render("msg",{
      msg:'1 point deleted !'
    })
  }catch(e){
    res.render("msg",{
      msg:'failed to delete points*'
    })
    console.log(e);
  }
}
let ulist=async(req,res)=>{
  try{
    let session=req.session;
    let postid=new ObjectId(session.postid);
    await POST.findById(postid).then((data)=>{
      res.render("admin/uplist",{
        pid:data.id,
        lists:data.lists,
      })
      console.log(data.lists)
    })
  }catch(e){
    res.render("msg",{
      msg:'failed to load points*'
    })
    console.log(e);
  }
}
let newlp=async(req,res)=>{
  try{
    let session=req.session;
    let postid=new ObjectId(session.postid);
    await POST.updateMany({_id:postid,'lists':{$elemMatch:{_id:req.params.id}}},{
      $set:{"lists.$.list":req.body.list}
    },{$upsert:true})
    res.render("msg",{
      msg:'1 list point updated !!'
    })
  }catch(e){
    res.render("msg",{
      msg:'failed to update points*'
    })
    console.log(e);
  }
}
module.exports={plist,lp,dltlist,ulist,newlp};

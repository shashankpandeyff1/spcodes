require('dotenv').config()
let ABOUT=require("../models/abt");
let TECH=require("../models/tech");
let PROJECT=require("../models/project");
let POST=require("../models/post");
let CONTACT=require("../models/inquiry");
let CDET=require("../models/condetails");
let SUBS=require("../models/subs");
let STAT=require("../models/stat");
let MAILLOG=require("../models/maillog");
let mongoose=require("mongoose");
const { ObjectId } = mongoose.Types;
let showcmt=async(req,res)=>{
  try{
    req.session.projectid=req.params.id;
    PROJECT.findById(req.params.id).then((data)=>{
      res.render("admin/pcmt",{
        comments:data.comments,
      })
    })
  }catch(e){
    res.render("msg",{
      msg:"failed to fetch users*"
    });
    console.log(e);
  }
}
let dpc=async(req,res)=>{
  try{
    let session=req.session;
    let projectid=new ObjectId(session.projectid);
    await PROJECT.findByIdAndUpdate(projectid,{
      $pull:{comments:{_id:req.params.id}}
    },{safe:true,multi:false})
    res.render("msg",{
      msg:"1 comment deleted from project"
    })
  }catch(e){
    res.render("msg",{
      msg:"failed to fetch project comments*"
    });
    console.log(e);
  }
}
module.exports={showcmt,dpc};

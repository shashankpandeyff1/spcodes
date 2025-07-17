require('dotenv').config()
let express=require("express");
let router=express.Router();
let hbs=require("hbs");
let mongoose=require("mongoose");
var nodemailer=require("nodemailer");
let multer=require("multer");
let cloudinary=require("cloudinary");
let POST=require("../models/post");
const { ObjectId } = mongoose.Types;
let metadata=async(req,res)=>{
  try{
     let metadata={
       id:req.body.id,
       head:req.body.head,
       para:req.body.para,
     }
       if(metadata.head.length==0 || metadata.head==undefined || metadata.head==null){
       if(!req.file){
         await POST.findByIdAndUpdate(metadata.id,{
           $push:{
             metadata:{para:metadata.para}
           }
         },{$new:true});
         res.render("msg",{
           msg:`metadata added !`
         })
         console.log("ap")
       }else{
         let result=await cloudinary.v2.uploader.upload(req.file.path,{
            use_filename:true,
            folder:'shashank portfolio app'
          })
         await POST.findByIdAndUpdate(metadata.id,{
           $push:{
             metadata:{para:metadata.para,npic:req.file.filename,npicurl:result.secure_url}
           }
         },{$new:true});
         res.render("msg",{
           msg:`metadata added !`
         })
       }
     }else if(metadata.para.length==0 || metadata.para==undefined || metadata.para==null){
       if(!req.file){
         await POST.findByIdAndUpdate(metadata.id,{
           $push:{
             metadata:{head:metadata.head}
           }
         },{$new:true});
         res.render("msg",{
           msg:`metadata added !`
         })
       }else{
         let result=await cloudinary.v2.uploader.upload(req.file.path,{
            use_filename:true,
            folder:'shashank portfolio app'
          })
         await POST.findByIdAndUpdate(metadata.id,{
           $push:{
             metadata:{head:metadata.head,npic:req.file.filename,npicurl:result.secure_url}
           }
         },{$new:true});
         res.render("msg",{
           msg:`metadata added !`
         })
       }
     }else if(!req.file){
       await POST.findByIdAndUpdate(metadata.id,{
         $push:{
           metadata:{head:metadata.head,para:metadata.para}
         }
       },{$new:true});
       res.render("msg",{
         msg:`metadata added !`
       })
     }else{
       let result=await cloudinary.v2.uploader.upload(req.file.path,{
          use_filename:true,
          folder:'shashank portfolio app'
        })
       await POST.findByIdAndUpdate(metadata.id,{
         $push:{
           metadata:{head:metadata.head,para:metadata.para,npic:req.file.filename,npicurl:result.secure_url}
         }
       },{$new:true});
       res.render("msg",{
         msg:`metadata added !`
       })
     }
  }catch(e){
    res.render("msg",{
      msg:"failed to add metadata"
    })
    console.log(e);
  }
}

let showmd=async(req,res)=>{
  try{
    req.session.postid=req.params.id;
    await POST.findById(req.params.id).then((data)=>{
      res.render("admin/pmd",{
        md:data.metadata,
      })
    //  console.log(data)
    })
    //console.log(data)
  }catch(e){
    res.render("msg",{
      msg:'failed to display metadata*'
    })
    console.log(e);
  }
}
let dmd=async(req,res)=>{
  try{
    let session=req.session;
    let postid=new ObjectId(session.postid);
    let post=await POST.findById(postid);
    await POST.findByIdAndUpdate(postid,{
      $pull:{
        metadata:{_id:req.params.id}
      }
    },{safe:true,multi:false});
    res.render("msg",{
      msg:`1 metadata deleted`
    })
  }catch(e){
    res.render("msg",{
      msg:"failed to delete metadata*"
    })
    console.log(e);
  }
}
let umd=async(req,res)=>{
  try{
    let session=req.session;
    let postid=new ObjectId(session.postid);
    let fp=await POST.findOne({_id:postid,'metadata':{$elemMatch:{_id:req.params.id}}});
    //User.findOne({'local.rooms': {$elemMatch: {name: req.body.username}}}
    await POST.findById(postid).then((data)=>{
      res.render("admin/upmd",{
        pid:req.params.id,
        md:fp,
      })
  //    console.log(data.metadata)
      console.log("h")
    })
    console.log(fp)
    console.log("gvvgb")
    console.log(req.params.id)
  }catch(e){
    res.render("msg",{
      msg:"failed to update metadata*"
    })
    console.log(e);
  }
}
let nmd=async(req,res)=>{
  try{
    let session=req.session;
    let postid=new ObjectId(session.postid);
      await POST.updateMany({_id:postid,'metadata':{$elemMatch:{_id:req.params.id}}},{
        $set:{"metadata.$.head":req.body.head,"metadata.$.para":req.body.para}
      },{$upsert:true})
      res.render("msg",{
        msg:"1 metadata updated !!"
      })
  }catch(e){
    res.render("msg",{
      msg:"failed to update metadata*"
    })
    console.log(e);
  }
}
module.exports ={ metadata,showmd,dmd,umd,nmd};

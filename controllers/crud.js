require('dotenv').config()
let express=require("express");
let router=express.Router();
let hbs=require("hbs");
let mongoose=require("mongoose");
let multer=require("multer");
let cloudinary=require("cloudinary");
let ABOUT=require("../models/abt");
let TECH=require("../models/tech");
let PROJECT=require("../models/project");
let POST=require("../models/post");
let CDET=require("../models/condetails");
let STAT=require("../models/stat");
let CONTACT=require("../models/inquiry");
let SUBS=require("../models/subs");
const { ObjectId } = mongoose.Types;
let showCRUD=async(req,res)=>{
  try{
    let about=await ABOUT.find().sort({_id:-1});    let cdet=await CDET.find().sort({_id:-1});
    let contact=await CONTACT.find().sort({_id:-1});
    let posts=await POST.find().sort({_id:-1});
    let projects=await PROJECT.find().sort({_id:-1});
    let subs=await SUBS.find().sort({_id:-1});
    let techs=await TECH.find().sort({_id:-1});
    let cond=await CDET.find().sort({'_id':-1}).limit(1);
    let session=req.session;
    if(session.adminaccess){
      res.render("admin/crud",{
        aboutdata:about,
        condet:cdet,
        inquiry:contact,
        posts:posts,
        projects:projects,
        subs:subs,
        techs:techs,
        cond:cond,
      })
    }else{
      res.render("admin/login");
    }
  }catch(e){
    res.render("msg",{
      msg:e,
    })
    console.log(e);
  }
}
let deleteAbout=async(req,res)=>{
  try{
    await ABOUT.findByIdAndDelete(req.params.id);
    res.render("msg",{
      msg:`record deleted`
    })
  }catch(e){res.render("msg",{
    msg:e
  })
  console.log(e)}
}
let fetchabt=async(req,res)=>{
  try{
    ABOUT.findById(req.params.id).then((data)=>{
      res.render("admin/uabout",{
        about:data,
      })
    })
  }catch(e){
    res.render("msg",{
      msg:e
    })
    console.log(e)
  }
}
let updateAbout=async(req,res)=>{
  try{
    let result=await cloudinary.v2.uploader.upload(req.file.path,{
      use_filename:true,
      folder:'shashank portfolio app'
    })
    await ABOUT.findByIdAndUpdate(req.params.id,req.body);
    await ABOUT.updateMany({_id:req.params.id},{$set:{pic:req.file.filename}},{$upsert:true});
    await ABOUT.updateMany({_id:req.params.id},{$set:{picurl:result.secure_url}},{$upsert:true});
    res.render("msg",{
      msg:"updation successfull"
    })
  }catch(e){
    res.render("msg",{
      msg:e
    })
    console.log(e);
  }
}
let deleteCD=async(req,res)=>{
  try{
    await CDET.findByIdAndDelete(req.params.id);
    res.render("msg",{
      msg:"1 contact detail deleted"
    })
  }catch(e){
    console.log(e);
    res.render("msg",{
      msg:e
    })
  }
}
let fetchcd=async(req,res)=>{
  try{
    CDET.findById(req.params.id).then((data)=>{
      res.render("admin/ucondt",{
        cd:data
      })
      console.log(data)
    })
  }catch(e){
    res.render("msg",{
      msg:e
    })
    console.log(e);
  }
}
let updatecd=async(req,res)=>{
  try{
    await CDET.findByIdAndUpdate(req.params.id,req.body);
    res.render("msg",{
      msg:"1 contact detail updated successfully !!!"
    })
  }catch(e){
    res.render("msg",{
      msg:e
    })
    console.log(e);
  }
}
let deleteinq=async(req,res)=>{
  try{
    await CONTACT.findByIdAndDelete(req.params.id);
    res.render("msg",{
      msg:"1 inquiry deleted"
    })
  }catch(e){
    res.render("msg",{
      msg:e
    })
    console.log(e);
  }
}
let deletepost=async(req,res)=>{
  try{
    await POST.findByIdAndDelete(req.params.id);
    res.render("msg",{
      msg:"1 post deleted"
    })
  }catch(e){
    res.render("msg",{
      msg:e
    })
    console.log(e);
  }
}
let fetchpost=async(req,res)=>{
  try{
    POST.findById(req.params.id).then((data)=>{
      res.render("admin/upost",{
        post:data
      })
      console.log(data)
    })
  }catch(e){
    res.render("msg",{
      msg:e
    })
    console.log(e);
  }
}
let updatepost=async(req,res)=>{
  try{
    await POST.findByIdAndUpdate(req.params.id,req.body);
    let result=await cloudinary.v2.uploader.upload(req.file.path,{
      use_filename:true,
      folder:'shashank portfolio app'
    })
    await POST.findByIdAndUpdate(req.params.id,req.body);
    await POST.updateMany({_id:req.params.id},{$set:{pic:req.file.filename}},{$upsert:true});
    await POST.updateMany({_id:req.params.id},{$set:{picurl:result.secure_url}},{$upsert:true});
    res.render("msg",{
      msg:"post updated successfully !!!"
    })
  }catch(e){
    res.render("msg",{
      msg:e
    })
    console.log(e);
  }
}
let cc=async(req,res)=>{
  try{
   req.session.postid=req.params.id;
    POST.findById(req.params.id).then((data)=>{
      res.render("admin/comment",{
        comment:data.comments
      })
    })
  }catch(e){
    res.render("msg",{
      msg:e
    })
    console.log(e);
  }
}
let dltcom=async(req,res)=>{
  try{
    let session=req.session;
    let postid=new ObjectId(session.postid);
    console.log(postid);
    let post=await POST.findOne({_id:session.postid});
    console.log(post.comments)
    await POST.findByIdAndUpdate(postid,{
      $pull:{comments:{_id:req.params.id}}
    },{safe:true,multi:false})
    res.render("msg",{
      msg:"1 comment deleted"
    })
  }catch(e){
    res.render("msg",{
      msg:e
    })
    console.log(e)
  }
}
let dpro=async(req,res)=>{
  try{
    await PROJECT.findByIdAndDelete(req.params.id);
    res.render("msg",{
      msg:"1 project deleted"
    })
  }catch(e){
    res.render("msg",{
      msg:e
    })
    console.log(e);
  }
}
let upro=async(req,res)=>{
  try{
    PROJECT.findById(req.params.id).then((data)=>{
      res.render("admin/uproject",{
        project:data,
      })
    })
  }catch(e){
    res.render("msg",{
      msg:e
    })
    console.log(e);
  }
}
let uproject=async(req,res)=>{
  try{
    await PROJECT.findByIdAndUpdate(req.params.id,req.body);
    res.render("msg",{
      msg:"1 project updated"
    })
  }catch(e){
    res.render("msg",{
      msg:e
    })
    console.log(e);
  }
}
let showpp=async(req,res)=>{
  try{
    req.session.projectid=req.params.id;
     PROJECT.findById(req.params.id).then((data)=>{
       res.render("admin/ppics",{
         ppics:data.pics,
       })
     }).catch((err)=>{
       res.render("msg",{
         msg:err
       })
     })
  }catch(e){
    res.render("msg",{
      msg:e
    })
    console.log(e);
  }
}
let deletepp=async(req,res)=>{
  try{
    let session=req.session;
    let projectid=new ObjectId(session.projectid);
    await PROJECT.findByIdAndUpdate(projectid,{
      $pull:{pics:{_id:req.params.id}}
    },{safe:true,multi:false})
    res.render("msg",{
      msg:`1 project pic deleted`
    })
  }catch(e){
    res.render("msg",{
      msg:e
    })
    console.log(e);
  }
}
let updatepp=async(req,res)=>{
  try{
    let session=req.session;
    let projectid=new ObjectId(session.projectid);
    //User.findOne({'local.rooms': {$elemMatch: {name: req.body.username}}},
    PROJECT.findById(projectid,{'pics':{$elemMatch:{_id:req.params.id}}}).then((data)=>{
      res.render("admin/showpp",{
        ppics:data.pics,
      })
      let pp=data.pics;
    })
  }catch(e){
    res.render("msg",{
      msg:e
    })
    console.log(e);
  }
}
let newpp=async(req,res)=>{
  try{
    let session=req.session;
    let projectid=new ObjectId(session.projectid);
    let result=await cloudinary.v2.uploader.upload(req.file.path,{
      use_filename:true,
      folder:'shashank portfolio app'
    })
  /*  await PROJECT.updateMany({_id:projectid,"pics.id":req.params.id},{
      $set:{"pics.$.pic":req.file.filename,"pics.$.picurl":result.secure_url}
    },{$upsert:true})*/
    await PROJECT.updateMany({_id:projectid,'pics':{$elemMatch:{_id:req.params.id}}},{
      $set:{"pics.$.pic":req.file.filename,"pics.$.picurl":result.secure_url}
    },{$upsert:true})
    res.render("msg",{
      msg:"1 project pic updated successfully !!!"
    })
  }catch(e){
    res.render("msg",{
      msg:e
    })
    console.log(e);
  }
}
let deletesub=async(req,res)=>{
  try{
    await SUBS.findByIdAndDelete(req.params.id);
    res.render("msg",{
      msg:"1 subscriber removed"
    })
  }catch(e){
    res.render("msg",{
      msg:e
    })
    console.log(e);
  }
}
let deletetech=async(req,res)=>{
  try{
    await TECH.findByIdAndDelete(req.params.id);
    res.render("msg",{
      msg:"1 technology removed"
    })
  }catch(e){
    res.render("msg",{
      msg:e
    })
    console.log(e);
  }
}
let updatetech=async(req,res)=>{
  try{
    TECH.findById(req.params.id).then((data)=>{
      res.render("admin/utech",{
        techs:data,
      })
    })
  }catch(e){
    res.render("msg",{
      msg:e
    })
    console.log(e);
  }
}
let updatedtech=async(req,res)=>{
  try{
    await TECH.findByIdAndUpdate(req.params.id,req.body);
    res.render("msg",{
      msg:"1 technology updated successfully !!!"
    })
  }catch(e){
    res.render("msg",{
      msg:e
    })
    console.log(e);
  }
}
let cs=async(req,res)=>{
  try{
    req.session.postid=req.params.id;
    POST.findById(req.params.id).then((data)=>{
      res.render("admin/source",{
        source:data.source,
    })
  }).catch((err)=>{
    res.render("msg",{
      msg:"failed to load this post sources*"
    })
  })
}catch(e){
  res.render("msg",{
    msg:e
  })
  console.log(e);
}
}
let dsource=async(req,res)=>{
  try{
    let session=req.session;
    let postid=new ObjectId(session.postid);
    await POST.findByIdAndUpdate(postid,{
      $pull:{source:{_id:req.params.id}}
    },{safe:true,multi:false})
    res.render("msg",{
      msg:"1 source deleted"
    })
  }catch(e){
    res.render("msg",{
      msg:e
    })
    console.log(e);
  }
}
module.exports={showCRUD,deleteAbout,fetchabt,updateAbout,deleteCD,fetchcd,updatecd,deleteinq,deletepost,fetchpost,updatepost,cc,dltcom,dpro,upro,uproject,showpp,
deletepp,updatepp,newpp,deletesub,deletetech,updatetech,updatedtech,cs,dsource};

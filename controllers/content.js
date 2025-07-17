let mongoose=require("mongoose");
const { ObjectId } = mongoose.Types;
let POST=require("../models/post");
let ADMIN=require("../models/admin");
let userDB=async(req,res)=>{
  try{
    let session=req.session;
    let finduser=await ADMIN.findOne({uname:session.aname,mail:session.amail,flag:0});
    let lastpost=await POST.findOne({uid:finduser._id}).sort({"_id":-1});
    let postflag=await POST.find({uid:finduser._id});
    let postflagno=await POST.find({uid:finduser._id,show:false});
    let totalpost=await POST.findOne({uid:finduser._id}).count();
    let log=[];
    if(!lastpost){
      res.render("admin/users/content",{
        uname:finduser.uname,
        lastpost:'create your first blog post now,start sharing your views with the world through your words !',
        totalpost:'0',
        loginat:finduser.loginat,
      });
  }else if(!totalpost){
    res.render("admin/users/content",{
      lastpost:'create your first blog post now,start sharing your views with the world through your words !',
      uname:finduser.uname,
      totalpost:'0',
      lastpost:lastpost.title,
      loginat:finduser.loginat,
    });
}else if(!lastpost && !totalpost){
  res.render("admin/users/content",{
    uname:finduser.uname,
    lastpost:'create your first blog post now,start sharing your views with the world through your words !',
    loginat:finduser.loginat,
    totalpost:'0',
  });
}else{
  res.render("admin/users/content",{
    uname:finduser.uname,
    lastpost:lastpost.title,
    totalpost:totalpost,
    loginat:finduser.loginat,
    yourposts:lastpost,
    yourposts:postflag,
    drafts:postflagno,
  });
}
  }catch(e){
    res.render("msg",{
      msg:'CONNECTION DENIED*',
    })
    console.log(e)
  }
}
module.exports=userDB;

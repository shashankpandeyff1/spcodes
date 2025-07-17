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
let ADMIN=require("../models/admin");
let KEYWORD=require("../models/keywords");
let showAdminPage=async(req,res)=>{
  try{
    let stats=await STAT.find().limit(1);
    let ir=await CONTACT.find().count();
    let tp=await POST.find().count();
    let tpr=await PROJECT.find().count();
    let ts=await SUBS.find().count();
    let tl=await TECH.find().count();
    let cond=await CDET.find().sort({'_id':-1}).limit(1);
    let session=req.session;
    if(session.adminaccess){
    res.render("admin/admin",{
      stats:stats,
      ir:ir,
      tp:tp,
      tpr:tpr,
      ts:ts,
      tl:tl,
      cond:cond,
    });
  }else if(session.contentaccess){
    let session=req.session;
    let finduser=await ADMIN.findOne({uname:session.aname,mail:session.amail,flag:0});
    let lastpost=await POST.findOne({uid:finduser._id}).sort({"_id":-1});
    let totalpost=await POST.findOne({uid:finduser._id}).count();
    let postflag=await POST.findOne({uid:finduser._id,show:true});
    let postflagno=await POST.findOne({uid:finduser._id,show:false});
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
    yourposts:postflag,
    drafts:postflagno,
  });}
  }else{
    res.render("admin/login");
  }
  }catch(e){
    let cond=await CDET.find().sort({'_id':-1}).limit(1);
    res.render("msg",{
      msg:e,
      cond:cond,
    })
  }
}
let storeAbt=async(req,res)=>{
  try{
  let result=await cloudinary.v2.uploader.upload(req.file.path,{
    use_filename:true,
    folder:'shashank portfolio app'
  })
  let abt=new ABOUT({
     pic:req.file.filename,
     picurl:result.secure_url,
     abt:req.body.abt,
     doc:req.body.doc,
     tag:req.body.tag,
  })
  let saveabt=await abt.save();
  let cond=await CDET.find().sort({'_id':-1}).limit(1);
  res.render("msg",{
    msg:abt,
    cond:cond,
  })
}catch(e){
  let cond=await CDET.find().sort({'_id':-1}).limit(1);
  res.render("msg",{
    msg:e,
    cond:cond,
  })
  console.log(e);
}
}
let newtech=async(req,res)=>{
  try{
  console.log("tech");
  console.log(req.body.doc);
  let tech=new TECH({
    tech:req.body.tech,
    why:req.body.why,
    doc:req.body.doc,
  })
  let savetech=await tech.save();
  let cond=await CDET.find().sort({'_id':-1}).limit(1);
  res.render("msg",{
    msg:tech,
    cond:cond,
  })
}catch(e){
  let cond=await CDET.find().sort({'_id':-1}).limit(1);
  res.render("msg",{msg:e,
    cond:cond,
  })
   console.log(e);
}
}
let project=async(req,res)=>{
  try{
    let result=await cloudinary.v2.uploader.upload(req.file.path,{
      use_filename:true,
      folder:'shashank portfolio app'
    })
    let project=new PROJECT({
      title:req.body.title,
      intro:req.body.intro,
      dou:req.body.dou,
      pics:[{
      pic:req.file.filename,
      picurl:result.secure_url,
    }]
    })
    let saveproject=await project.save();
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
      subject:`Shashank Pandey's has added a new Project on his site`,
      text:`Project title:${project.title}.Published on ${project.dou}.Visit Shashank Pandey's site to check out a new project.`
    }
    transporter.sendMail(mailOptions,(err,res)=>{
      if(err){
        console.log(err);
      }else{
        console.log(`mail sent`)
      }
    })
    let date= new Date();
    let day=date.getDate();let month=date.getMonth()+1;let year=date.getFullYear();
    let md=`${day}-${month}-${year}`;
    let mt=`${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    let maillog=new MAILLOG({
      from:mailOptions.from,
      to:allsubs,
      subject:mailOptions.subject,
      text:mailOptions.text,
      doc:`date:${md},time:${mt}`,
    })
    let saveml=await maillog.save();
    let cond=await CDET.find().sort({'_id':-1}).limit(1);
    res.render("msg",{
      msg:`${project.title} added !!`,
      cond:cond,
    })
  }catch(e){
    let cond=await CDET.find().sort({'_id':-1}).limit(1);
    res.render("msg",{
      msg:e,
      cond:cond,
    })
    console.log(e);
  }
}
let projectpic=async(req,res)=>{
  try{
    let id=req.body.id;
    let result=await cloudinary.v2.uploader.upload(req.file.path,{
      use_filename:true,
      folder:'shashank portfolio app'
    })
  let uq=  await PROJECT.findByIdAndUpdate(id,{
    $push:{pics:{pic:req.file.filename,picurl:result.secure_url}}}
    ,{$new:true});
  if(uq){
    let cond=await CDET.find().sort({'_id':-1}).limit(1);
    res.render("msg",{
      msg:`new pic added to ${uq.title} `,
      cond:cond,
    })
  }
  }catch(e){
    let cond=await CDET.find().sort({'_id':-1}).limit(1);
    res.render("msg",{
      msg:e,
      cond:cond,
    })
    console.log(e);
  }
}
let likepro=async(req,res)=>{
  try{
    let pid=req.params.id;
    let count=0;
    console.log("new page")
    let lp=await  PROJECT.findById(req.params.id);
    let vc=await PROJECT.findById(req.params.id);
  /*  if(vc.views==undefined){
      count++;
      await PROJECT.findByIdAndUpdate(pid,{views:count},{$upsert:true});
    }
    else{
      let tviews=vc.views;
      tviews++;
      await PROJECT.findByIdAndUpdate(pid,{views:tviews},{$upsert:true});
    }*/
    if(lp.likes==undefined){
      let fp=await PROJECT.findById(req.params.id);
      let fp2=await PROJECT.find({_id:req.params.id});
      count++;
      let cond=await CDET.find().sort({'_id':-1}).limit(1);
      await PROJECT.findByIdAndUpdate(pid,{likes:count},{$upsert:true});
      let lp2=await  PROJECT.findById(pid);
      /*res.render("users/pinfo",{
        pinfo:fp2,
        name:fp.pics,
        comments:fp.comments,
        cond:cond,
      })*/
    }
    else{
      let tlikes=lp.likes;
      tlikes++;
      await PROJECT.findByIdAndUpdate(pid,{likes:tlikes},{$upsert:true});
      console.log("afew likes r there");
    }
    let pv=[];
    let fp=await PROJECT.findById(req.params.id);
    let fp2=await PROJECT.find({_id:req.params.id});
    let cond=await CDET.find().sort({'_id':-1}).limit(1);
    let pics=fp.pics.map((data)=>{
     pv.push(data.picurl);
      console.log(pv)
    });
    res.render("users/pinfo",{
      pinfo:fp2,
      name:fp.pics,
      comments:fp.comments,
      cond:cond,
    })
    console.log(lp);
    console.log(lp.likes);
  }catch(e){
    let cond=await CDET.find().sort({'_id':-1}).limit(1);
    console.log(e);
    res.render("msg",{
      msg:e,
      cond:cond,
    })
  }
}
let pinfo=async(req,res)=>{
  try{
  let pv=[];
  let count=0;
  let pid=req.params.id;
  let fp=await PROJECT.findById(req.params.id);
  let fp2=await PROJECT.find({_id:req.params.id});
  let cond=await CDET.find().sort({'_id':-1}).limit(1);
  let pics=fp.pics.map((data)=>{
   pv.push(data.picurl);
    console.log(pv)
  });
  let lp=await  PROJECT.find({_id:req.params.id});
  let vc=await PROJECT.findById(req.params.id);
  if(vc.views==undefined){
    count++;
    await PROJECT.findByIdAndUpdate(pid,{views:count},{$upsert:true});
  }
  else{
    let tviews=vc.views;
    tviews++;
    await PROJECT.findByIdAndUpdate(pid,{views:tviews},{$upsert:true});
  }
  let fp3=await PROJECT.findById(req.params.id);
  let fp4=await PROJECT.find({_id:req.params.id});
  let bKW=await KEYWORD.find({cat:'portfolio'});
  res.render("users/pinfo",{
    pinfo:fp4,
    name:fp3.pics,
    comments:fp3.comments,
    cond:cond,
    keywords:bKW,
  })
}catch(e){
  let cond=await CDET.find().sort({'_id':-1}).limit(1);
  res.render("msg",{
    msg:e,
    cond:cond,
  })
  console.log(e);
}
}
let newpost=async(req,res)=>{
  try{
    let cuser=req.session;
    let fu=await ADMIN.findOne({uname:cuser.aname,mail:cuser.amail});
    let result=await cloudinary.v2.uploader.upload(req.file.path,{
      use_filename:true,
      folder:'shashank portfolio app'
    })
    let post=new POST({
      title:req.body.title,
      doc:req.body.doc,
      pic:req.file.filename,
      picurl:result.secure_url,
      exp:req.body.exp,
      con:req.body.con,
      source:[
        {
          url:req.body.source,
        }
      ],uid:fu._id,cat:req.body.cat,
    })
    let savepost=await post.save();
    req.session.postinfo=savepost;
    let cond=await CDET.find().sort({'_id':-1}).limit(1);
/*    let allsubs=[];
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
      text:`Post title:${post.title}.Published on ${post.doc}.Visit Shashank Pandey's site to check new blog post.`
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
    let saveml=await maillog.save();*/
    /*res.render("msg",{msg:`new post created,${post.title}`,
      cond:cond,
    })*/
    let stats=await STAT.find().limit(1);
    let ir=await CONTACT.find().count();
    let tp=await POST.find().count();
    let tpr=await PROJECT.find().count();
    let ts=await SUBS.find().count();
    let tl=await TECH.find().count();
    let session=req.session;
    if(session.adminaccess){
    res.render("admin/admin",{
      stats:stats,
      ir:ir,
      tp:tp,
      tpr:tpr,
      ts:ts,
      tl:tl,
      cond:cond,
      postid:savepost._id,
    });
  }else if(session.contentaccess){
    let session=req.session;
    let finduser=await ADMIN.findOne({uname:session.aname,mail:session.amail,flag:0});
    let lastpost=await POST.findOne({uid:finduser._id}).sort({"_id":-1});
    let totalpost=await POST.findOne({uid:finduser._id}).count();
    let log=[];
    if(!lastpost){
    res.render("admin/users/content",{
      uname:finduser.uname,
    //  lastpost:lastpost.title,
      totalpost:totalpost,
      loginat:finduser.loginat,
    });
  }else if(!totalpost){
  res.render("admin/users/content",{
    uname:finduser.uname,
    lastpost:lastpost.title,
  //  totalpost:totalpost,
    loginat:finduser.loginat,
  });
}else if(!lastpost && !totalpost){
  res.render("admin/users/content",{
    uname:finduser.uname,
  //  lastpost:lastpost.title,
    //totalpost:totalpost,
    loginat:finduser.loginat,
  });
}else{
  res.render("admin/users/content",{
    uname:finduser.uname,
    lastpost:lastpost.title,
    totalpost:totalpost,
    loginat:finduser.loginat,
    postid:savepost._id,
  });
}
  /*  res.render("admin/users/content",{
      postid:savepost._id,
    });*/
  }
  }catch(e){
    let cond=await CDET.find().sort({'_id':-1}).limit(1);
    res.render("msg",{
      msg:e,
      cond:cond,
    })
    console.log(e)
  }
}
let binfo=async(req,res)=>{
  try{
    let pid=req.params.id;
    let count=0;
    let blog=await POST.find({_id:req.params.id});
    let vc=await POST.findById(req.params.id);
    let cond=await CDET.find().sort({'_id':-1}).limit(1);
    let bKW=await KEYWORD.find({cat:'blogs'});
    console.log(blog.views);
    if(vc.views==undefined){
      count++;
      await POST.findByIdAndUpdate(pid,{views:count},{$upsert:true});
    }else{
      let view=vc.views;
      view++;
      await POST.findByIdAndUpdate(pid,{views:view},{$upsert:true});
    }
    let blog2=await POST.find({_id:req.params.id});
    let keywords=[];let kw=[];
    res.render("users/binfo",{
      title:vc.title,
      list:vc.lists,
      blog:blog2,
      comments:vc.comments,
      cond:cond,
      source:vc.source,
      metad:vc.metadata,
      lists:vc.lists,
      keywords:bKW,
    })
  }catch(e){
    let cond=await CDET.find().sort({'_id':-1}).limit(1);
    res.render("msg",{
      msg:e,cond:cond,
    })
    console.log(e);
  }
}
let likeblog=async(req,res)=>{
  try{
    let count=0;
    let pid=req.params.id;
    let fp=await POST.findById(pid);
    if(fp.likes==undefined){
      count++;
      await POST.findByIdAndUpdate(pid,{likes:count},{$upsert:true});
    /*  res.render("binfo",{
        blog:blog,
        comments:vc.comments,
        cond:cond,
        source:vc.source,
      })*/
    }else{
      let tl=fp.likes;
      tl++;
      await POST.findByIdAndUpdate(pid,{likes:tl},{$upsert:true});
  /*    res.render("binfo",{
        blog:blog,
        comments:vc.comments,
        cond:cond,
        source:vc.source,
      })*/
    }
    let blog=await POST.find({_id:req.params.id});
    let vc=await POST.findById(req.params.id);
    let cond=await CDET.find().sort({'_id':-1}).limit(1);
    res.render("users/binfo",{
      blog:blog,
      comments:vc.comments,
      cond:cond,
      source:vc.source,
      metad:vc.metadata,
      lists:vc.lists,
    })
  }catch(e){
    let cond=await CDET.find().sort({'_id':-1}).limit(1);
    res.render("msg",{
      msg:e,cond:cond,
    })
    console.log(e)
  }
}
let comment=async(req,res)=>{
  try{
  let pv=[];
  let pid=req.body.id;
  await POST.findByIdAndUpdate(pid,{$push:{comments:{comment:req.body.comment}}},{$upsert:true});
  let blog=await POST.find({_id:pid});
  let bc=await POST.findById(pid);
  let cond=await CDET.find().sort({'_id':-1}).limit(1);
  /*let pics=bc.pics.map((data)=>{
   pv.push(data.picurl);
    console.log(pv)
  });*/
  res.render("users/binfo",{
    blog:blog,
    comments:bc.comments,
    cond:cond,
    source:bc.source,
    metad:bc.metadata,
    lists:bc.lists,
  })
//  console.log(bc.comments);
}catch(e){
  let cond=await CDET.find().sort({'_id':-1}).limit(1);
  res.render("msg",{
    msg:e,cond:cond,
  })
  console.log(e);
}
}
let contact=async(req,res)=>{
  try{
    let contact=new CONTACT({
      uname:req.body.uname,
      mail:req.body.mail,
      msg:req.body.msg,
      doc:req.body.doc,
    })
    let savecontact=await contact.save();
    let abt=await ABOUT.find().sort({'_id':-1}).limit(1);
    let techs=await TECH.find().sort({'_id':-1});
    let projects=await PROJECT.find().sort({'_id':-1});
    let posts=await POST.find().sort({'_id':-1});
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
    let cond=await CDET.find().sort({'_id':-1}).limit(1);
    res.render("msg",{
      msg:e,
      cond:cond,
    })
    console.log(e)
  }
}
let cond=async(req,res)=>{
  try{
    let cond=new CDET({
      author:req.body.author,
      mail:req.body.mail,
      mob:req.body.mob,
      insta:req.body.insta,
      linkedin:req.body.linkedin,
      twitter:req.body.twitter,
      doc:req.body.doc,
    })
    let savecond=await cond.save();
    let cond2=await CDET.find().sort({'_id':-1}).limit(1);
    res.render("msg",{
      msg:cond,cond:cond2
    })
  }catch(e){
    let cond2=await CDET.find().sort({'_id':-1}).limit(1);
    res.render("msg",{
      msg:e,cond:cond2,
    })
    console.log(e)
  }
}
let subscribe=async(req,res)=>{
  try{
    let email=req.body.mail;
    let checkmail=await SUBS.findOne({mail:email});
    if(checkmail){
      res.render("msg",{
        msg:"mail in use,try other email"
      })
    }else{
      let mail=new SUBS({
        doc:req.body.doc,
        mail:email,
      })
      let subscribe=await mail.save();
      //sendmailtosub();
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
      //  to:allsubs,
        to:req.body.mail,
        subject:'subscription on shashankpandey.com',
text:`You have subscribed successfully to shashank pandey's portfolio site,a mail will be send to you when a new blog post or project will be added on this site ${req.body.url}
        `
      }
      transporter.sendMail(mailOptions,(err,res)=>{
        if(err){
          console.log(err);
        }else{
          console.log(`mail sent`)
        }
      })
      let date= new Date();
      let day=date.getDate();let month=date.getMonth()+1;let year=date.getFullYear();
      let md=`${day}-${month}-${year}`;
    //  console.log(md)
      let mt=`${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    //  console.log(mt)
      let maillog=new MAILLOG({
        from:mailOptions.from,
        to:`${mail.mail}`,
        subject:mailOptions.subject,
        text:mailOptions.text,
        doc:`date:${md},time:${mt}`,
      })
      let saveml=await maillog.save();
      let cond=await CDET.find().sort({'_id':-1}).limit(1);
      res.render("msg",{
        msg:`${email} subscription successfull !!!`,cond:cond,
      })
    }
    //console.log("gfgftgfg")
  }catch(e){
    let cond=await CDET.find().sort({'_id':-1}).limit(1);
    res.render("msg",{
      msg:e,cond:cond,
    })
    console.log(e);
  }
}
let commentp=async(req,res)=>{
  try{
  let pv=[];
  let pid=req.body.id;
  await PROJECT.findByIdAndUpdate(pid,{$push:{comments:{comment:req.body.comment}}},{$upsert:true});
  let project=await PROJECT.find({_id:pid});
  let bc=await PROJECT.findById(pid);
  let cond=await CDET.find().sort({'_id':-1}).limit(1);
  res.render("users/pinfo",{
    pinfo:project,
    comments:bc.comments,
    name:bc.pics,
    cond:cond,
  })
  //console.log(bc.comments);
}catch(e){
  let cond=await CDET.find().sort({'_id':-1}).limit(1);
  res.render("msg",{
    msg:e,cond:cond,
  })
}
}
let nsource=async(req,res)=>{
  try{
    let id=req.body.id;
    let source=req.body.source;
  let ns=  await POST.findByIdAndUpdate(id,{$push:{source:{url:source}}},{$new:true})
    console.log("hi")
    let cond=await CDET.find().sort({'_id':-1}).limit(1);
   if(ns){
      res.render("msg",{
        msg:`new source added to ${ns.title}`,cond:cond,
      })
    }else{
      res.render("msg",{
        msg:"failed to add a source to post",cond:cond,
      })
    }
  }catch(e){
    let cond=await CDET.find().sort({'_id':-1}).limit(1);
    res.render("msg",{
      msg:e,cond:cond,
    })
    console.log(e);
  }
}
module.exports={showAdminPage,storeAbt,newtech,project,projectpic,likepro,pinfo,newpost,binfo,likeblog,comment,contact,cond,subscribe,commentp,nsource};

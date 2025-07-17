require('dotenv').config()
let ABOUT=require("../models/abt");
let TECH=require("../models/tech");
let PROJECT=require("../models/project");
let POST=require("../models/post");
let CDET=require("../models/condetails");
let STAT=require("../models/stat");
let SUBS=require("../models/subs");
let ADMIN=require("../models/admin");
let CONTACT=require("../models/inquiry");
let bcrypt=require("bcryptjs");
let nodemailer=require("nodemailer");
let step1=async(req,res)=>{
  try{
    res.render("admin/login");
  }catch(e){
    res.render("msg",{
      msg:e
    })
    console.log(e);
  }
}
let cc2=async(req,res)=>{
  try{
    let uname=req.body.uname;
    let pass=req.body.password;
    let fu=await ADMIN.findOne({uname:uname,flag:1});
    let fu2=await ADMIN.findOne({uname:uname,flag:0});
    console.log("fu2" + fu2)
    let otp=Math.floor(100000 + Math.random() * 900000)
    if(fu){
      let cbp=await bcrypt.compare(pass,fu.password);
      if(cbp){
      req.session.amail=fu.mail;
      req.session.aname=fu.uname;
      req.session.aotp=otp;
      let transporter=nodemailer.createTransport({
        service:'gmail',
        auth:{
          user:'shashankspandey04@gmail.com',
          pass:process.env.mail_pass
        }
      })
      var mailOptions={
        from:'shashankspandey04@gmail.com',
        to:`${fu.mail}`,
        subject:'admin login shashankpandey',
        text:`CODE:${otp}`,
      }
      transporter.sendMail(mailOptions,(err,res)=>{
        if(err){
          console.log(err);
        }else{
          console.log(`mail sent`)
        }
      })
      res.render("admin/mail");
    }else{
      res.render("msg",{
        msg:"login failed*",
      })
    }}else if(fu2){
      let cbp2=await bcrypt.compare(pass,fu2.password);
      if(cbp2){
      req.session.amail=fu2.mail;
      req.session.aname=fu2.uname;
      req.session.aotp=otp;
      let transporter=nodemailer.createTransport({
        service:'gmail',
        auth:{
          user:'shashankspandey04@gmail.com',
          pass:process.env.mail_pass
        }
      })
      var mailOptions={
        from:'shashankspandey04@gmail.com',
        to:`${fu2.mail}`,
        subject:'admin login shashankpandey',
        text:`CODE:${otp}`,
      }
      transporter.sendMail(mailOptions,(err,res)=>{
        if(err){
          console.log(err);
        }else{
          console.log(`mail sent`)
        }
      })
      res.render("admin/mail");
    }
    else{
      res.render("msg",{
        msg:"login failed*",
      })
  }
  }
    else{
      res.render("msg",{
        msg:"login failed 1*",
      })
    }
  }catch(e){
    res.render("msg",{
      msg:"login failed2 *",
    })
    console.log(e);
  }
}
let verifycode=async(req,res)=>{
  try{
    let session=req.session;
    let motp=session.aotp;
    let otp=req.body.otp;
    let nuser=await ADMIN.findOne({uname:session.aname,flag:0});
    console.log("nusuer" + nuser)
    let nuser2=await ADMIN.findOne({uname:session.aname,flag:1});
    let date= new Date();
    let day=date.getDate();let month=date.getMonth()+1;let year=date.getFullYear();
    let md=`${day}-${month}-${year}`;
    console.log(md)
    let mt=`${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    let loginat=`DATE:${md},TIME:${mt}`;
    if(motp==otp){
      if(nuser){
        req.session.contentaccess="allowed";
        await ADMIN.findByIdAndUpdate(nuser._id,{$push:{loginat:{time:loginat}}},{$upsert:true});
        let session=req.session;
        let finduser=await ADMIN.findOne({uname:session.aname,mail:session.amail,flag:0});
        let lastpost=await POST.findOne({uid:finduser._id}).sort({"_id":-1});
        let totalpost=await POST.findOne({uid:finduser._id}).count();
        let postflag=await POST.find({uid:finduser._id});
        let postflagno=await POST.find({uid:finduser._id,show:false});
        let log=[];
        let likesarr=[];
        let likes=await POST.find({_id:finduser._id,flag:0},{_id:0,likes:1});
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
      });
    }
      }else if(nuser2){
        req.session.adminaccess="allowed";
        let stats=await STAT.find().limit(1);
        let ir=await CONTACT.find().count();
        let tp=await POST.find().count();
        let tpr=await PROJECT.find().count();
        let ts=await SUBS.find().count();
        let tl=await TECH.find().count();
        let cond=await CDET.find().sort({'_id':-1}).limit(1);
        await ADMIN.findByIdAndUpdate(nuser2._id,{$push:{loginat:{time:loginat}}},{$upsert:true});
        res.render("admin/admin",{
          stats:stats,
          ir:ir,
          tp:tp,
          tpr:tpr,
          ts:ts,
          tl:tl,
          cond:cond,
        });
      }
    }else{
      res.render("msg",{
        msg:"login failed***",
      })
    }
  }catch(e){
    res.render("msg",{
      msg:"login failed c*",
    })
    console.log(e);
  }
}
let logout=async(req,res)=>{
  try{
    req.session.destroy((err)=>{
      res.render("msg",{
        msg:'ADMIN LOGGED OUT'
      })
    })
  }catch(e){
    res.render("msg",{
      msg:'logout failed*'
    })
  }
}
let fp=async(req,res)=>{
  try{
    res.render("admin/fp");
  }catch(e){
    res.render("msg",{
      msg:'invalid Credentials'
    })
    console.log(e)
  }
}
let fpost=async(req,res)=>{
  try{
    let uname=req.body.uname;
    let mail=req.body.mail;
    let fu=await ADMIN.findOne({uname:uname,mail:mail,flag:1});
    let fu2=await ADMIN.findOne({uname:uname,mail:mail,flag:0});
    let otp=Math.floor(100000 + Math.random() * 900000)
    if(fu){
      req.session.aname2=uname;
      req.session.amail2=mail;
      req.session.fpotp=otp;
      let transporter=nodemailer.createTransport({
        service:'gmail',
        auth:{
          user:'shashankspandey04@gmail.com',
          pass:process.env.mail_pass
        }
      })
      let mailOptions={
        from:'shashankspandey04@gmail.com',
        to:`${fu.mail}`,
        subject:'Use this OTP to reset password for A.P Access',
        text:`OTP:${otp}`
      }
      transporter.sendMail(mailOptions,(err,resp)=>{
        if(err){
          console.log(err);
          console.log(`mail not send`)
        }else{
          console.log(`mail sent successfully`)
        }
      });
    res.render("admin/mail2");
  }else if(fu2){
    req.session.aname2=uname;
    req.session.amail2=mail;
    req.session.fpotp=otp;
    let transporter=nodemailer.createTransport({
      service:'gmail',
      auth:{
        user:'shashankspandey04@gmail.com',
        pass:process.env.mail_pass
      }
    })
    let mailOptions={
      from:'shashankspandey04@gmail.com',
      to:`${fu2.mail}`,
      subject:'Use this OTP to reset password for A.P Access',
      text:`OTP:${otp}`
    }
    transporter.sendMail(mailOptions,(err,resp)=>{
      if(err){
        console.log(err);
        console.log(`mail not send`)
      }else{
        console.log(`mail sent successfully`)
      }
    });
  res.render("admin/mail2");
}else{
    res.render("msg",{
      msg:"invalid Credentials*"
    })
  }
  }catch(e){
    res.render("msg",{
      msg:'invalid Credentials*'
    })
    console.log(e)
  }
}
let changepass=async(req,res)=>{
  try{
    let session=req.session;
    let otp=req.body.otp;
    let motp=session.fpotp;
    if(otp==motp){
    /*  req.session.adminaccess="allowed";
      if(session.adminaccess){
      let stats=await STAT.find().limit(1);
      let ir=await CONTACT.find().count();
      let tp=await POST.find().count();
      let tpr=await PROJECT.find().count();
      let ts=await SUBS.find().count();
      let tl=await TECH.find().count();
      let cond=await CDET.find().sort({'_id':-1}).limit(1);
      res.render("admin/admin",{
        stats:stats,
        ir:ir,
        tp:tp,
        tpr:tpr,
        ts:ts,
        tl:tl,
        cond:cond,
      });*/
      res.render("admin/newpass");
    }else{
      res.render("admin/login");
    }
    /*}else{
      res.render("msg",{
        msg:'login failed*'
      })
    }*/
  }catch(e){
    res.render("msg",{
      msg:e
    })
    console.log(e);
  }
}
let newpass=async(req,res)=>{
  try{
    let pass=req.body.password;
    let encryptpass= await bcrypt.hash(pass,10);
    let session=req.session;
    let uname=session.aname2;
    let mail=session.amail2;
    let cu1=await ADMIN.findOne({uname:uname,flag:1});
    let cu2=await ADMIN.findOne({uname:uname,flag:0});
    if(cu1){
    await ADMIN.updateOne({uname:uname,mail:mail,flag:1},{$set:{password:encryptpass}},{$upsert:true});
    res.render("msg",{
      msg:'Credentials Updated !'
    })
  }else if(cu2){
    await ADMIN.updateOne({uname:uname,mail:mail,flag:0},{$set:{password:encryptpass}},{$upsert:true});
    res.render("msg",{
      msg:'Credentials Updated !'
    })
  }else{
    res.render("msg",{
      msg:'password updation failed*'
    })
  }
  }catch(e){
    res.render("msg",{
      msg:'password updation failed*'
    })
    console.log(e);
  }
}
module.exports={step1,cc2,verifycode,logout,fp,fpost,changepass,newpass};

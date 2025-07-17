let ADMIN=require("../models/admin");
let bcrypt=require("bcryptjs");
let nodemailer=require("nodemailer");
let manageusers=async(req,res)=>{
  try{
    let session=req.session;
    if(session.adminaccess){
      res.render("admin/manageusers");
    }else{
      res.render("admin/login");
    }
  }catch(e){
    res.render("msg",{
      msg:'failed to load*'
    })
    console.log(e);
  }
}
let newuser=async(req,res)=>{
  try{
    let date= new Date();
    let day=date.getDate();let month=date.getMonth()+1;let year=date.getFullYear();
    let md=`${day}-${month}-${year}`;
    let mt=`${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    let loginat=`DATE:${md},TIME:${mt}`;
    let newuser=new ADMIN({
      uname:req.body.uname,
      mail:req.body.mail,
      password:req.body.pass,
      role:req.body.role,
      flag:0,
      loginat:[{time:loginat}],
    })
    let add=await newuser.save();
    var transporter=nodemailer.createTransport({
      service:'gmail',
      auth:{
        user:'shashankspandey04@gmail.com',
        pass:process.env.mail_pass
      }
    })
    var mailOptions={
      from:'shashankspandey04@gmail.com',
      to:`${add.mail}`,
      subject:`signed up to shashank pandey's portfolio site for content writing`,
      text:`use this credentials to login into the Dashboard to make blog posts. Your username:${add.uname},password:${req.body.pass}.It is advisable to change your password after your first login for security reasons so kindly take the note.`

    }
    transporter.sendMail(mailOptions,(err,resp)=>{
      if(err){
        console.log(err)
      }else{
        console.log(`mail sent!`);
      }
    })
    let users=await ADMIN.find({flag:0});
    res.render("admin/manageusers",{
      users:users,
    })
  }catch(e){
    res.render("msg",{
      msg:'failed to add new user*'
    })
    console.log(e);
  }
}
module.exports={manageusers,newuser};

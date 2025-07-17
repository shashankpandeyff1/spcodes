let mongoose=require("mongoose");
let inq=new mongoose.Schema({
  uname:{
    required:true,
    type:String,
    maxLength:25,
    lowercase:true,
  },
  mail:{
    required:true,
    type:String,
    lowercase:true,
  },msg:{
    required:true,
    type:String,
    maxLength:250,
    lowercase:true,
  },doc:{
    type:String,
  }
})
let CONTACT=new mongoose.model("CONTACT",inq);
module.exports=CONTACT;

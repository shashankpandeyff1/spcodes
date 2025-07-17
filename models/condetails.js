let mongoose=require("mongoose");
let cd=new mongoose.Schema({
  author:{
    required:true,
    type:String,
    maxLength:25,
    lowercase:true,
  },
  mail:{
    required:true,
    type:String,
  },
  mob:{
    required:true,
    type:Number,
    maxLength:120,
  },
  insta:{
    required:true,
    type:String,
  },
  linkedin:{
    required:true,
    type:String,
  },
  twitter:{
    required:true,
    type:String,
  },
  doc:{
    required:true,
    type:String,
  }
})
let CDET=new mongoose.model("CDET",cd);
module.exports=CDET;

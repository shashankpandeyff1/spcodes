let mongoose=require("mongoose");
let techs=new mongoose.Schema({
  tech:{
    required:true,
    type:String,
    maxLength:25,
    lowercase:true,
  },
  why:{
    required:true,
    type:String,
    maxLength:120,
    lowercase:true,
  },
  doc:{
    required:true,
    type:String,  
  }
})
let TECH=new mongoose.model("TECH",techs);
module.exports=TECH;

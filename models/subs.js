let mongoose=require("mongoose");
let subs=new mongoose.Schema({
  doc:{
    type:String,
  },
  mail:{
    type:String,
    required:true,
    unique:true,
  }
})
let SUBS=new mongoose.model("SUBS",subs);
module.exports=SUBS;

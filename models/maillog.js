let mongoose=require("mongoose");
let maillog=new mongoose.Schema({
  from:{
    type:String,
    trim:true,
  },
  to:[{
    type:String,
    trim:true,
  }],
  subject:{
    type:String,
    trim:true,
  },
  text:{
    type:String,
    trim:true,
  },
  doc:{
    type:String,
    trim:true,
  }
})
let MAILLOG=new mongoose.model("MAILLOG",maillog);
module.exports=MAILLOG;

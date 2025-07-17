let mongoose=require("mongoose");
let stat=new mongoose.Schema({
  msg:{
    type:String,
  },
  views:{
    type:Number,
  },
  likes:{
    type:Number,
  }
})
let STAT=new mongoose.model("STAT",stat);
module.exports=STAT;

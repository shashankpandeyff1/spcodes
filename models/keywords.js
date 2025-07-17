let mongoose=require("mongoose");
let keywords=new mongoose.Schema({
  keyword:{
    type:String,
    required:true,
    length:500,
  },
  cat:{
    type:String,
    required:true,
  }
})
let KEYWORD=new mongoose.model("KEYWORD",keywords);
module.exports=KEYWORD;

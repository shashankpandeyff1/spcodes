let mongoose=require("mongoose");
let projects=new mongoose.Schema({
  title:{
    required:true,
    type:String,
    maxLength:100,
  //  lowercase:true,
  },
  intro:{
    required:true,
    type:String,
    maxLength:10000,
  //  lowercase:true,
  },
  dou:{
    required:true,
    type:String,
  },
  views:{
    type:Number,
  },
  likes:{
    type:Number,
  },
  pics:[{
    pic:{
      required:true,
      type:String,
    },
    picurl:{
      required:true,
      type:String,
    }
  }],
  users:[{
    type:String,
    trim:true,
  }],
  comments:[{
    comment:{
    type:String,
    lowercase:true,}
  }]
})
let PROJECT=new mongoose.model("PROJECT",projects);
module.exports=PROJECT;

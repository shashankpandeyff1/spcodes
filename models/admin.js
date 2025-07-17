let mongoose=require("mongoose");
let bcrypt=require("bcryptjs");
let admin=new mongoose.Schema({
  uname:{
    type:String,
    required:true,
    trim:true,
    unique:true,
  },
  mail:{
    type:String,
    required:true,
    trim:true,
    unique:true,
  },
  password:{
    type:String,
    required:true,
    trim:true,
  },
  role:{
    type:String,
  },
  flag:{
    type:Number,
    trim:true,
  },
  loginat:[{ time:{type :String} }]
})
admin.pre("save",async function(next){
  if(this.isModified('password')){
    this.password=await bcrypt.hash(this.password,10);
    next();
  }
})
let ADMIN=new mongoose.model("ADMIN",admin);
module.exports=ADMIN;

require('dotenv').config()
let mongoose=require("mongoose");
let uri=process.env.DATABASE_URI;
let connectDB=async()=>{
  try{
  mongoose.set('strictQuery',true);
  return mongoose.connect(uri,{
    useNewUrlParser:true,
    useUnifiedTopology:true
  })
}catch(e){
  console.log("db connection failed*");
  console.log(e);
}
}
module.exports=connectDB;

require('dotenv').config()
let express=require("express");
let app=express();
let hbs=require("hbs");
let mongoose=require("mongoose");
let port=process.env.PORT || 8000;
let all_files=require("./routers/router");
let connectDB=require("./db/conn");
app.use("/",all_files);
app.set("view engine","hbs");
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.get("/",(req,res)=>{
  res.send("<h1>welcome to shashank pandey's portfolio :)</h1>");
})
app.get("/*",(req,res)=>{
res.render("msg",{
  msg:'ERROR 404:PAGE NOT FOUND'
})
})
let connectApp=async()=>{
  try{
    await connectDB();
    console.log("db connected!!!!");
    app.listen(port,()=>{
    console.log(`app listening on port ${port}`);
})
}catch(e){
  console.log(e);
}
}
connectApp();

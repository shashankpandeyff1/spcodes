let KEYWORD=require("../models/keywords");
let mongoose=require("mongoose")
let keyword=async(req,res)=>{
  try{
    let keywords=new KEYWORD({
      keyword:req.body.keyword,
      cat:req.body.cat,
    })
    let saveKW=await keywords.save();
    res.render("msg",{
      msg:`${req.body.keyword} added!`
    })
  }catch(e){
    res.render("msg",{
      msg:'failed to add new keywords*'
    })
    console.log(e);
  }
}
module.exports = keyword;

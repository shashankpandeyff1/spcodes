let POST=require("../models/post");
let CDET=require("../models/condetails");
let PROJECT=require("../models/project");
let filterpost=async(req,res)=>{
  try{
    let param=req.params.filter;
    let posts=null;
    let pc=await POST.find({show:true}).count();
    let cond=await CDET.find().sort({'_id':-1}).limit(1);
    if(param=='mtl'){
      posts=await POST.find({show:true}).sort({'_id':-1});
      console.log(posts);
    }else if(param=='lth'){
      posts=await POST.find({show:true}).sort({'_id':1});
      console.log(posts);
    }else if(param=='cricposts'){
      posts=await POST.find({show:true,cat:'cricket'}).sort({'_id':-1});
      console.log(posts);
    }
    res.render("users/allposts",{
      posts:posts,
      pc:pc,
      cond:cond,
    })
  }catch(e){
    res.render("msg",{
      msg:"failed to retrieve data*"
    })
    console.log(e);
  }
}

let filterproject=async(req,res)=>{
  try{
    let param=req.params.filter;
    let posts=null;
    let pc=await PROJECT.find().count();
    let cond=await CDET.find().sort({'_id':-1}).limit(1);
    if(param=='mtl'){
      posts=await PROJECT.find().sort({'_id':-1});
      console.log(posts);
    }else if(param=='lth'){
      posts=await PROJECT.find().sort({'_id':1});
      console.log(posts);
    }
    res.render("users/allprojects",{
      projects:posts,
      pc:pc,
      cond:cond,
    })
  }catch(e){
    res.render("msg",{
      msg:"failed to retrieve data*"
    })
    console.log(e);
  }
}
let gen=async(req,res)=>{
  try{
    await POST.updateMany({_id:'653e068802ece56cc14dd4d5'},{$set:{cat:'cricket'}},{$upsert:true})
    res.send("<h1>ohhhhhhh yeahhh </h1>")
  }catch(e){
    res.render("msg",{
      msg:"failed to retrieve data*"
    })
    console.log(e);
  }
}

module.exports = {filterpost,filterproject,gen};

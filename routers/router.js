require('dotenv').config()
let express=require("express");
let router=express.Router();
let hbs=require("hbs");
let mongoose=require("mongoose");
let multer=require("multer");
let cloudinary=require("cloudinary");
let session=require("express-session");
let {showHomePage,likeapp}=require("../controllers/home");
router.use(express.json());
router.use(express.urlencoded({extended:true}));
let {showAdminPage,storeAbt,newtech,project,projectpic,likepro,pinfo,newpost,binfo,likeblog,comment,contact,cond,subscribe,commentp,nsource
}=require("../controllers/admin");
let {showCRUD,deleteAbout,fetchabt,updateAbout,deleteCD,fetchcd,updatecd,deleteinq,deletepost,fetchpost,updatepost,cc,dltcom,dpro,upro,uproject,showpp,
deletepp,updatepp,newpp,deletesub,deletetech,updatetech,updatedtech,cs,dsource}=require("../controllers/crud");
let {unsubscribe,otpvalid}=require("../controllers/unsubscribe");
let scode=require("../controllers/scode");
let {allposts,allprojects}=require("../controllers/pp");
let {step1,cc2,verifycode,logout,fp,fpost,changepass,newpass}=require("../controllers/alogin");
let {showcmt,dpc}=require("../controllers/project");
let {metadata,showmd,dmd,umd,nmd}=require("../controllers/metadata");
let {plist,lp,dltlist,ulist,newlp}=require("../controllers/list");
let {notify,uploadDraft}=require('../controllers/notify');
let {filterpost,filterproject,gen}=require("../controllers/filter");
let {manageusers,newuser}=require("../controllers/manageusers.js");
let userDB=require("../controllers/content")
let keyword=require("../controllers/keyword")
router.use(session({
  secret: process.env.secret,
  resave: false,
  saveUninitialized: true,
}))
cloudinary.config({
  cloud_name:process.env.cloud_name,
  api_key:process.env.api_key,
  api_secret:process.env.api_secret
})
let storage=multer.diskStorage({
  filename:function(req,file,cb){
    cb(null,Date.now() + file.originalname)
  }
})
let upload=multer({storage:storage});
//home
router.route("/").get(showHomePage);
//admin
router.route("/adminpanelofspapbpcp").get(showAdminPage);
//about info
router.route("/abt").post(upload.single('pic'),storeAbt);
//tech
router.route("/techie").post(newtech);
//project
router.route("/project").post(upload.single('pic'),project);
//project pic
router.route("/npic").post(upload.single('pic'),projectpic);
//like project
router.route("/likepro/:id").get(likepro);
//project Information
router.route("/pinfo/:id").get(pinfo);
//post
router.route("/post").post(upload.single('pic'),newpost);
//post info
router.route("/binfo/:id").get(binfo);
//like blog
router.route("/likeblog/:id").get(likeblog);
//comment
router.route("/comment").post(comment);
//contact
router.route("/contact").post(contact);
// contact details
router.route("/cond").post(cond);
//like app
router.route("/likeapp/:id").get(likeapp);
//subscribe
router.route("/subs").post(subscribe);
//crud
router.route("/crud").get(showCRUD);
//delete about
router.route("/dabt/:id").get(deleteAbout);
//fetch about
router.route("/uabt/:id").get(fetchabt).post(upload.single('pic'),updateAbout);
//delete contact detail
router.route("/dcondt/:id").get(deleteCD);
//fetch contact details
router.route("/ucondt/:id").get(fetchcd).post(updatecd);
//delete inquiry
router.route("/dinq/:id").get(deleteinq);
//delete post
router.route("/dpost/:id").get(deletepost);
//add metadata
router.route("/metadata").post(upload.single('npic'),metadata);
//show md
router.route("/pmd/:id").get(showmd);
//dlt md
router.route("/dltmd/:id").get(dmd);
//upd md
router.route("/upmd/:id").get(umd);
//new md
router.route("/nmd/:id").post(nmd);
//update post
router.route("/upost/:id").get(fetchpost).post(upload.single('pic'),updatepost);
//check comments
router.route("/cc/:id").get(cc);
//delete comments
router.route("/dcom/:id").get(dltcom);
//delete project
router.route("/dpro/:id").get(dpro);
//update project
router.route("/upro/:id").get(upro).post(uproject);
//show pp
router.route("/showpp/:id").get(showpp);
//delete pp
router.route("/deletepp/:id").get(deletepp);
//update  pp
router.route("/updatepp/:id").get(updatepp).post(upload.single('pic'),newpp);
//delete subscriber
router.route("/dsub/:id").get(deletesub);
//delete tech
router.route("/dtech/:id").get(deletetech);
//update tech
router.route("/utech/:id").get(updatetech).post(updatedtech);
//unsubscribe
router.route("/unsubscribe").post(unsubscribe);
//otp work
router.route("/unsubscribepass").post(otpvalid)
//Source code
router.route("/scode/:id").post(scode);
//comment
router.route("/commentp").post(commentp);
//source
router.route("/nsource").post(nsource);
//all posts
router.route("/allposts").get(allposts);
//route plist
router.route("/plist").post(plist);
router.route("/listpoint/:id").get(lp);
router.route("/dltlist/:id").get(dltlist);
router.route('/ulist/:id').get(ulist);
router.route('/uplist/:id').post(newlp);
//all projects
router.route("/allprojects").get(allprojects);
//admin login
router.route("/shashankpandeylogintomanagedata").get(step1);
router.route("/login").post(cc2);
router.route("/mail").post(verifycode);
//check Source
router.route("/cs/:id").get(cs);
//delete Source
router.route("/dltsource/:id").get(dsource);
//check Users
router.route("/showpc/:id").get(showcmt);
//dlt project cmt
router.route("/dpcmt/:id").get(dpc);
router.route('/notifyusers').get(notify);
router.route("/logout").get(logout);
//add ac
//router.route("/nac").get(nac);
router.route("/fp").get(fp).post(fpost);
router.route("/mail2").post(changepass);
router.route("/newpass").post(newpass);
//postfilter
router.route("/postfilter/:filter").get(filterpost);
router.route("/projectfilter/:filter").get(filterproject);
//manage Users
router.route("/manageusers").get(manageusers);
router.route("/newuser").post(newuser);
router.route("/uploaddraft/:id").get(uploadDraft)
router.route("/content").get(userDB);
router.route("/gen").get(gen);
router.route("/addkeywords").post(keyword);
//router.route("/dall").get(dall);
module.exports=router;

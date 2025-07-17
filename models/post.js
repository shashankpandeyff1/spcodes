let mongoose=require("mongoose");
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId;
let posts=new mongoose.Schema({
  title:{
    required:true,
    type:String,
    maxLength:100,
  //  lowercase:true,
  },
  doc:{
    required:true,
    type:String,
  },
  pic:{
    required:true,
    type:String,
  },
  picurl:{
    required:true,
    type:String,
  },
  exp:{
    required:true,
    type:String,
    maxLength:10000,
    //lowercase:true,
  },
  con:{
    required:true,
    type:String,
    maxLength:9000,
    //lowercase:true,
  },
  metadata:[
    {
      head:{
        type:String,
        maxLength:100,
      },
      para:{
        type:String,
        maxLength:10000,
      },
      npic:{
        type:String,
      },
      npicurl:{
        type:String,
      }
    }
  ],
  lists:[{
    list:{
      type:String,
      maxLength:700,
    }
  }
  ],
  comments:[{
    comment:{
    type:String,
    lowercase:true,}
  }],views:{
    type:Number,
  },
  likes:{
    type:Number,
  },
  source:[{
    url:{
    type:String,
  }
}],
show:{
  type: Boolean,
  default: false
},uid:{
  type: ObjectId,
  ref: 'ADMIN'
},
cat:{
  type:String,
}
})
let POST=new mongoose.model("POST",posts);
module.exports=POST;

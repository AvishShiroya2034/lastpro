import mongoose from "mongoose";
const itemSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    clothType:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Cloths",
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
      type:Number,
      required:true
    }
    ,
    image: {
      public_id: { type: String },
      url: { type: String },
    },
  },
  { timestamps: true }
);

const itemModel = await mongoose.model("Items", itemSchema);
export default itemModel;

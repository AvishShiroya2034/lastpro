import mongoose from "mongoose";
const clothSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    categoryType:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
        required:true
    },
    description:{
        type:String,
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

const clothModel = await mongoose.model("Cloths", clothSchema);
export default clothModel;

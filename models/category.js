import mongoose from "mongoose";
const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique:[true,"The Type Already Exists"]
    },
    image: {
      public_id: { type: String },
      url: { type: String },
    },
  },
  { timestamps: true }
);

const categoryModel = await mongoose.model("Category", categorySchema);
export default categoryModel;

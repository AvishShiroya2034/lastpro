import categoryModel from "../models/category.js";
import cloudinary from "cloudinary";
import { getDataUri } from "../utils/features.js";
import clothModel from "../models/cloths.js";
import itemModel from "../models/items.js";
//add the cloth
export const addClothController = async (req, res) => {
  try {
    const { name, categoryType, description } = req.body;
    console.log(description);
    if (!name || !categoryType || !description) {
      return res.status(401).send({
        success: false,
        message: "Please Provide All Fileds",
      });
    }
    const category = await categoryModel.findOne({
      name: { $regex: new RegExp(categoryType, "i") },
    });
    if (!category) {
      return res.status(401).send({
        success: false,
        message: "Category Not Available",
      });
    }
    console.log(category._id);
    if (!req.file) {
      return res.status(401).send({
        success: false,
        message: "Please Add The File",
      });
    }
    const file = getDataUri(req.file);
    const cdb = await cloudinary.v2.uploader.upload(file.content);
    if (!cdb) {
      return res.status(401).send({
        success: false,
        message: "File Doesn't Uploaded",
      });
    }
    // console.log(cdb);
    const image = {
      public_id: cdb.public_id,
      url: cdb.secure_url,
    };
    const cloth = new clothModel({
      name,
      categoryType: category._id,
      description,
      image,
    });

    await cloth.save();
    res.status(200).send({
      success: true,
      message: "Cloth Add Successfully",
      data: cloth,
    });
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      message: "Error in add cloth API",
    });
  }
};

//getAll the Cloth
export const getAllClothController = async (req, res) => {
  try {
    const cloths = await clothModel.find({}).populate("categoryType");
    if (!cloths) {
      return res.status(401).send({
        success: false,
        message: "Clothtype Not Available",
      });
    }
    res.status(200).send({
      success: true,
      message: "ClothTypes",
      data: cloths,
    });
  } catch (error) {
    return res.status(401).send({
      success: false,
      message: "Error in getall cloth type",
      error,
    });
  }
};

//get cloth category data on the categoryType id
export const getClothController = async (req,res)=>{
  try {
    const category = await categoryModel.findById(req.params.id);
    if(!category){
      return res.status(401).send({
        success:false,
        message:"Category Not Available"
      })
    }
    const cloths = await clothModel.find({categoryType:category._id}).populate('categoryType');
    if(!cloths){
      return res.status(401).send({
        success:false,
        message:"Given ClothType Not Available"
      })
    }
    res.status(200).send({
      success:true,
      message:"ClothTypes From CategoryID",
      cloths
    })
  } catch (error) {
    console.log(error);
    return res.status(401).send({
      success:false,
      message:"error in GetClothViaCategoryID API",
      error
    })
  }
}

//update the cloth
export const updateClothController = async (req, res) => {
  try {
    const { name, categoryType, description } = req.body;
    const cloth = await clothModel.findById({ _id: req.params.id });
    if (!cloth) {
      return res.status(401).send({
        success: false,
        message: "Cloth Not Available",
      });
    }
    if (categoryType) {
      const category = await categoryModel.findOne({
        name: { $regex: new RegExp(categoryType, "i") },
      });
      if (!category) {
        return res.status(401).send({
          success: false,
          message: "Category Unavailable",
        });
      }
      if (category._id) cloth.categoryType = category._id;
    }
    //********delete previous image and update image**********
    if (req.file) {
      const file = getDataUri(req.file);
      //delete previous image
      const deleteImage = await cloudinary.v2.uploader.destroy(
        cloth.image.public_id
      );
      if (!deleteImage) {
        return res.status(401).send({
          success: false,
          message: "Image doesn't Deleted",
        });
      }
      //update
      const cdb = await cloudinary.v2.uploader.upload(file.content);
      if (!cdb) {
        return res.status(401).send({
          success: false,
          message: "Image doesn't uploaded",
        });
      }
      const image = {
        public_id: cdb.public_id,
        url: cdb.secure_url,
      };
      if (image) cloth.image = image;
    }
    if (name) cloth.name = name;
    if (description) cloth.description = description;

    //save database
    await cloth.save();
    res.status(200).send({
      success: true,
      message: "Update Successfully",
      cloth,
    });
  } catch (error) {
    console.log(error);
    return res.status(401).send({
      success: false,
      message: "Error in Cloth Update API",
      error,
    });
  }
};

//delete cloth category
export const deleteClothController = async (req, res) => {
  try {
    const { id } = req.params;
    const cloth = await clothModel.findById({ _id: id });
    // console.log(cloth)
    if (!cloth) {
      return res.status(404).send({
        success: false,
        message: "Cloth Not Found",
      });
    }
    //delete item
    const items = await itemModel.find({ clothType: cloth._id });
    // console.log(items)
    if (!items) {
      return res.status(401).send({
        success: false,
        message: "Cloth(item) Can Not Be Deleted",
      });
    }
    //delete cloth image
    const deleteImage = await cloudinary.v2.uploader.destroy(
      cloth.image.public_id
    );
    if (!deleteImage) {
      return res.status(401).send({
        success: false,
        message: "Cloth Photo Can Not Be Deleted",
      });
    }
    //delete items
    const deleteItem = await itemModel.deleteMany({ clothType: cloth._id });
    if (!deleteItem) {
      return res.status(401).send({
        success: false,
        message: "Cloth(item) Can Not Be Deleted",
      });
    }
    //delete cloth
    await cloth.deleteOne();
    res.status(200).send({
      success: true,
      message: "cloth delete",
      cloth,
    });
  } catch (error) {
    console.log(error);
    return res.status(401).send({
      success: false,
      message: "Error In Delete Cloths API",
    });
  }
};

import itemModel from "../models/items.js";
import cloudinary from "cloudinary";
import { getDataUri } from "../utils/features.js";
import clothModel from "../models/cloths.js";
import categoryModel from "../models/category.js";
export const createItemController = async (req, res) => {
  try {
    const { name, description, clothName, categoryName, price } = req.body;
    if (!description || !name || !clothName || !categoryName || !price) {
      return res.send(401).send({
        success: false,
        message: "Please Provide All Details",
      });
    }
    const category = await categoryModel.findOne({
      name: { $regex: new RegExp(categoryName, "i") },
    });
    if (!category) {
      return res.status(401).send({
        success: false,
        message: "Category Not Available",
      });
    }
    console.log(category._id);
    const clothData = await clothModel.findOne({
      name: { $regex: new RegExp(clothName, "i") },
      categoryType:category._id,
    });
    if (!clothData) {
      return res.status(401).send({
        success: false,
        message: "Cloth Doesn't Available",
      });
    }
    // console.log(req.file)
    if (!req.file) {
      return res.status(401).send({
        success: false,
        message: "Please Provide the image of Washing Type",
      });
    }
    const file = getDataUri(req.file);
    const cdb = await cloudinary.v2.uploader.upload(file.content);
    if (!cdb) {
      return res.status(401).send({
        success: false,
        message: "Image doesn't uploaded",
      });
    }
    // console.log(cdb.secure_url)
    const image = {
      public_id: cdb.public_id,
      url: cdb.secure_url,
    };
    const item = new itemModel({
      name,
      description,
      clothType: clothData._id,
      price,
      image,
    });
    await item.save();

    res.status(200).send({
      success: true,
      message: "Item Add Successfully",
      data: item,
    });
  } catch (error) {
    console.log(error);
    return res.status(401).send({
      success: false,
      message: "Error In Item Add API ",
    });
  }
};

// Find All Items

export const allItemsFindController = async (req, res) => {
  try {
    const items = await itemModel
      .find({})
      .populate({
        path: "clothType",
        populate: {
          path: "categoryType",
        },
      })
      .exec();
    if (!items) {
      return res.status(401).send({
        success: false,
        message: "Please Add The Items In Data",
      });
    }
    return res.status(200).send({
      success: true,
      message: "Items Of DryClean",
      items,
    });
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      message: "Error In Find All Items API",
    });
  }
};

//fid the item using the cloths id
export const getItemsController = async (req,res)=>{
  try {
    const cloth = await clothModel.findById(req.params.id);
    if(!cloth){
      return res.status(401).send({
        success:false,
        message:"clothType Not Available"
      })
    }
    // console.log(cloth)
    const items = await itemModel.find({clothType:req.params.id});
    if(!items[0]){
      return res.status(401).send({
        success:false,
        message:"Given Items Not Available"
      })
    }
    // console.log(items)
    res.status(200).send({
      success:true,
      message:"Items From clothID",
      items
    })
  } catch (error) {
    console.log(error);
    return res.status(401).send({
      success:false,
      message:"error in GetItemViaClothID API",
      error
    })
  }
}

//Update The Items
export const updateItemsController = async (req, res) => {
  try {
    const { id } = req.params;
    // console.log(id);
    const { categoryName, name, clothName, price,description } = req.body;
    const item = await itemModel.findById(id);
    if (!item) {
      return res.status(401).send({
        success: false,
        message: "Item Not Available",
      });
    }

    //check the cloth and category and update clothType
    if(clothName && !categoryName || categoryName && !clothName){
      return res.status(401).send({
        success: false,
        message: "require both category and cloth name",
      });
    }
    if(clothName && categoryName){
      const category = await categoryModel.findOne({
        name: { $regex: new RegExp(categoryName, "i") },
      });
      if (!category) {
        return res.status(401).send({
          success: false,
          message: "Category Not Available",
        });
      }
      console.log(category._id);
      const clothData = await clothModel.findOne({
        name: { $regex: new RegExp(clothName, "i") },
        categoryType:category._id,
      });
      if (!clothData) {
        return res.status(401).send({
          success: false,
          message: "Cloth Doesn't Available",
        });
      }else{
        item.clothType = clothData._id
      }
    }

    //********delete previous image and update image**********
    if(req.file){
    const file = getDataUri(req.file);
    //delete previous image
    const deleteImage = await cloudinary.v2.uploader.destroy(
      item.image.public_id
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
   if(image) item.image = image
  }
    if (name) item.name = name;
    if (price) item.price = price;
    if (description) item.description = description;
    

    await item.save();

    return res.status(200).send({
      success: true,
      message: "item Update Successfully",
      item,
    });
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: true,
      message: "Error In Update Items API",
    });
  }
};

export const deleteItemsController = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await itemModel.findById({ _id: id });
    if (!item) {
      return res.status(404).send({
        success: false,
        message: "Item Not Found",
      });
    }
    await item.deleteOne();
    res.status(404).send({
      success: true,
      message: "Item delete",
      item,
    });
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: true,
      message: "Error In Delete Items API",
    });
  }
};

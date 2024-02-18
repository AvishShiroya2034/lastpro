import { getDataUri } from "../utils/features.js";
import cloudinary from "cloudinary";
import categoryModel from "../models/category.js";
import itemModel from "../models/items.js";
import clothModel from "../models/cloths.js";
export const addCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(401).send({
        success: false,
        message: "Please Provide the name of category",
      });
    }
    console.log(req.file);
    if (!req.file) {
      return res.status(401).send({
        success: false,
        message: "Please Provide the image of category",
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
    console.log(cdb.secure_url);
    const image = {
      public_id: cdb.public_id,
      url: cdb.secure_url,
    };
    console.log(image);
    const category = new categoryModel({
      name,
      image,
    });
    await category.save();
    res.status(200).send({
      success: true,
      message: "category added successfully ",
      data:category
    });
  } catch (error) {
    console.log(error);
    res.status(401).send({
      message: "error in add category API",
      success: false,
    });
  }
};

export const getAllCategoryController = async (req, res) => {
  try {
    const categories = await categoryModel.find({});
    if (!categories) {
      return res.status(401).send({
        success: false,
        message: "Categories Not Available",
      });
    }
    res.status(200).send({
      success: true,
      message: "Categories",
      data: categories,
    });
  } catch (error) {
    console.log(error);
    res.status(401).send({
      message: "error in getAll category API",
      success: false,
    });
  }
};

export const updateCategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await categoryModel.findById({ _id: id });
    console.log(category);
    if (!category) {
      return res.status(401).send({
        success: false,
        message: "Category is not Available",
      });
    }
    const { name } = req.body;
    if (!name) {
      return res.status(401).send({
        success: false,
        message: "Please Add The Category Name",
      });
    }
    //if the image can not updated (only name)
    if (!req.file) {
      if (name) category.name = name;
      await category.save();
      return res.status(200).send({
        success: true,
        message: "category Updated",
        category,
      });
    }
    const file = getDataUri(req.file);
    //delete previous image
    const deleteImage = await cloudinary.v2.uploader.destroy(
      category.image.public_id
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
    if (name) category.name = name;
    if (image) category.image = image;
    //save
    await category.save();
    res.status(200).send({
      success: true,
      message: "category Updated",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      message: "Error In category Update API",
    });
  }
};
//delete the category
export const deleteCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findById(req.params.id);
    if (!category) {
      return res.status(401).send({
        success: false,
        message: "Category Not Available",
      });
    }
    const deleteImage = await cloudinary.v2.uploader.destroy(
      category.image.public_id
    );
    if (!deleteImage) {
      return res.status(401).send({
        success: false,
        message: "Image Can not delete",
      });
    }
    //find cloth where populate category
    const cloth = await clothModel.find({ categoryType: category._id });
    if (cloth) {
      cloth.map(async (item, index) => {
        //delete items where pupulate cloth
        const items = await itemModel.deleteMany({ clothType: item._id });
        if (!items) {
          res.status(401).send({
            success: false,
            message: "Category(item) can not Delete",
            cloth,
          });
        }
      });
    }
    //delete cloths
    const deleteCloth = await clothModel.deleteMany({categoryType:category._id});
    if (!deleteCloth) {
      res.status(401).send({
        success: false,
        message: "Category(cloth) can not Delete",
        cloth,
      });
    }
    await category.deleteOne();
    res.status(200).send({
      success: true,
      message: "category Delete",
      category,
      cloth,
    });
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      message: "Error In Delete Category API",
      error,
    });
  }
};

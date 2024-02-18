import express from "express";
import {
  allItemsFindController,
  createItemController,
  deleteItemsController,
  getItemsController,
  updateItemsController,
} from "../controller/itemController.js";
import { adminIsAuth, checkIsreceptionist } from "../middlewares/authMiddleware.js";
import { singleUpload } from "../middlewares/multer.js";
const router = express.Router();

//create item
router.post("/add", adminIsAuth, checkIsreceptionist, singleUpload, createItemController);
//Find All Item
router.get("/allItems", allItemsFindController);
//find item upon the cloth id
router.get('/getItems/:id',getItemsController)
//Update Item
router.put("/update/:id",adminIsAuth, singleUpload, updateItemsController);
//Delete Item
router.delete("/delete/:id", deleteItemsController);

export default router;

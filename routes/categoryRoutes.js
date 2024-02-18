import express from "express";
import { adminIsAuth, checkIsreceptionist } from "../middlewares/authMiddleware.js";
import { singleUpload } from "../middlewares/multer.js";
import { addCategoryController, deleteCategoryController, getAllCategoryController, updateCategoryController } from "../controller/categoryController.js";
const router = express();

//post the category
router.post('/add', adminIsAuth,checkIsreceptionist ,singleUpload, addCategoryController);
//Getall records
router.get('/get-all',getAllCategoryController)
//Update the Category
router.put('/update/:id',adminIsAuth,checkIsreceptionist,singleUpload,updateCategoryController)
//delete the category
router.delete('/delete/:id',adminIsAuth,checkIsreceptionist,deleteCategoryController)


export default router;
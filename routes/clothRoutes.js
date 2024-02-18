import  express  from "express";
import { adminIsAuth, checkIsreceptionist } from "../middlewares/authMiddleware.js";
import { singleUpload } from "../middlewares/multer.js";
import { addClothController, deleteClothController, getAllClothController, getClothController, updateClothController } from "../controller/clothController.js";
const router = express();

//add Cloths type
router.post('/add',adminIsAuth,checkIsreceptionist,singleUpload,addClothController)
//getAll cloth with populate the Category
router.get('/get-all',getAllClothController)
//find the cloth on the category id
router.get('/getCloths/:id',getClothController)
//update Cloth 
router.put('/update/:id',adminIsAuth,checkIsreceptionist,singleUpload,updateClothController)
//delete cloth
router.delete('/delete/:id',adminIsAuth,checkIsreceptionist,singleUpload,deleteClothController)

export default router
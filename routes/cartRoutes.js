import express from 'express'
import { isAuth } from '../middlewares/authMiddleware.js';
import { addToCartController, deleteCartItemController, getCartItemController, sortingCartDateController, updateCartItemController } from '../controller/cartController.js';
const router = express.Router();

//AddToCart
router.post('/add/:id',isAuth,addToCartController)
//Get All Cart Item using User Id
router.get('/get',isAuth,getCartItemController)
//Update The cart Item Quantity
router.put('/update/:id',isAuth,updateCartItemController)
//Dlete The cart Item 
router.delete('/delete/:id',isAuth,deleteCartItemController)
//get the cart item using date
router.get('/filterdate/:sortOrder',isAuth,sortingCartDateController)

export default router;
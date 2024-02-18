import cartModel from "../models/cart.js";
import itemModel from "../models/items.js";
import userModel from "../models/user.js";

export const addToCartController = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (!user) {
      return res.status(401).send({
        success: false,
        message: "User Not Found",
      });
    }
    const item = await itemModel.findById(req.params.id);
    if (!item) {
      return res.status(401).send({
        success: false,
        message: "Item Unavailable",
      });
    }
    const { quantity } = req.body;
    const total = quantity * item.price;
    const cartItem = new cartModel({
      user,
      item,
      quantity,
      total,
    });
    //save the cartItem
    await cartItem.save();
    res.status(200).send({
      success: true,
      message: "AddToCart Sucessfully",
      cartItem,
    });
  } catch (error) {
    console.log(error);
    return res.status(401).send({
      success: false,
      message: "Error IN AddToCart API",
      error,
    });
  }
};

export const getCartItemController = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (!user) {
      return res.status(401).send({
        success: false,
        message: "User Not Found",
      });
    }
    const cartItems = await cartModel.find({ user: user._id });
    if (!cartItems[0]) {
      return res.status(401).send({
        success: false,
        message: "Not Have Any Cart Items",
      });
    }
    res.status(200).send({
      success: true,
      message: "Carted Items",
      cartItems,
    });
  } catch (error) {}
};

export const updateCartItemController = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (!user) {
      return res.status(401).send({
        success: false,
        message: "User Not Found Login Please",
      });
    }
    const cartItem = await cartModel.findById(req.params.id).populate("item");
    if (!cartItem) {
      return res.status(401).send({
        success: true,
        message: "cartItem Unavailable",
      });
    }

    if (req.body.quantity) {
      cartItem.quantity = req.body.quantity;
      cartItem.total = req.body.quantity * cartItem.item.price;
    }
    await cartItem.save();
    res.status(200).send({
      success: true,
      message: "cartItem Updated !!",
      cartItem,
    });
  } catch (error) {
    console.log(error);
    return res.status(401).send({
      success: false,
      message: "Error In Update cartItem API",
      error,
    });
  }
};

//Delete The cart Item
export const deleteCartItemController = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (!user) {
      return res.status(401).send({
        success: false,
        message: "User is unauthorized",
      });
    }
    const cartItem = await cartModel.findById(req.params.id);
    if (!cartItem) {
      return res.status(401).send({
        success: false,
        message: "CartItem Not Available",
      });
    }
    //delete
    await cartItem.deleteOne();

    res.status(200).send({
      success: true,
      message: "Delete Cart Item Successfully",
      cartItem,
    });
  } catch (error) {
    console.log(error);
    return res.status(401).send({
      success: false,
      message: "Error in cartItem Delete API",
      error,
    });
  }
};

//sorting the via date
export const sortingCartDateController = async (req, res) => {
  try {
    const { sortOrder } = req.params;
    const user = await userModel.findById(req.user._id);
    if (!user) {
      return res.status(401).send({
        success: false,
        message: "User is unauthorized",
      });
    }
    const cartItem = await cartModel
      .find({user:req.user._id})
      .sort({'quantity':parseInt(sortOrder)}).exec();
      
    if (!cartItem) {
      return res.status(401).send({
        success: false,
        message: "CartItem Not Available",
      });
    }
    res.status(200).send({
      success: true,
      message: "Cart Item by sorting",
      cartItem,
    });
  } catch (error) {
    console.log(error);
    return res.status(401).send({
      success: false,
      message: "Error in sorting cart via data API",
      error,
    });
  }
};

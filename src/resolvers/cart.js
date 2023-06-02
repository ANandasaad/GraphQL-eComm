import { GraphQLError } from "graphql";
import Cart from "../model/cart.js";
import User from "../model/user.js";
import Product from "../model/product.js";
const cartResolvers = {
  Query: {
    getAllCartItem: async () => {
      try {
        const cartItems = await Cart.find()
          .populate("userId")
          .populate("item.productId");
        // console.log(cartItems);
        if (!cartItems) {
          throw new GraphQLError("Cart items is not found", {
            extensions: {
              code: "CART_ITEMS_NOT_FOUND",
            },
          });
        } else {
          return cartItems;
        }
      } catch (error) {
        throw new GraphQLError(`Error is found ${error}`, {
          extensions: {
            code: `ERROR_FOUND_${error}`,
          },
        });
      }
    },
    getCartItem: async (_, args, context) => {
      try {
        console.log("hit");
        console.log(args);
        const cartItemId = await Cart.findById(args.id)
          .populate("userId")
          .populate("item.productId");
        console.log(cartItemId);
        if (!cartItemId) {
          throw new GraphQLError("Cart is not Found", {
            extensions: {
              code: "CART_NOT_FOUND",
            },
          });
        } else {
          return cartItemId;
        }
      } catch (error) {
        throw new GraphQLError(`Error is found ${error}`, {
          extensions: {
            code: `ERROR_FOUND_${error}`,
          },
        });
      }
    },
  },
  Mutation: {
    addToCart: async (_, args, context) => {
      console.log(args);
      try {
        const { userId, productId, quantity, price } = args.input;
        const user = await User.findById(userId);
        if (!user) {
          throw new GraphQLError("User not found", {
            extensions: {
              code: "USER_NOT_FOUND",
            },
          });
        }
        const product = await Product.findById(productId);
        if (!product) {
          throw new GraphQLError("Product not found", {
            extensions: {
              code: "PRODUCT_NOT_FOUND",
            },
          });
        }
        const totalPrice = quantity * price;
        const newCart = new Cart({
          userId,
          item: [{ productId, quantity, price }],
          total: totalPrice,
        });
        const res = await newCart.save();
        // console.log(res);
        return {
          id: res.id,
          userId: {
            id: user._id.toString(),
            name: user.name,
          },
          item: [
            {
              productId: {
                id: product._id.toString(),
                description: product.description,
                name: product.name,
              },
              quantity,
              price,
            },
          ],
          total: totalPrice,
        };
      } catch (error) {
        throw new GraphQLError(`Error is found ${error}`, {
          extensions: {
            code: `ERROR_FOUND_${error}`,
          },
        });
      }
    },
    updateCart: async (_, args, context) => {
      console.log("hit");
      console.log(args);

      try {
        const { price, quantity, productId } = args.input;
        console.log(price);
        const updateId = await Cart.findById(args.id);
        if (!updateId) {
          throw new GraphQLError("Cart Item is not found", {
            extensions: {
              code: "CART_NOT_FOUND",
            },
          });
        }
        const updatedCart = await Cart.findByIdAndUpdate(
          args.id,
          {
            $set: {
              "item.$[elem].quantity": quantity,
              "item.$[elem].price": price,
            },
          },
          {
            new: true,
            arrayFilters: [{ "elem.productId": productId }],
          }
        );
        return updatedCart;
      } catch (error) {
        throw new GraphQLError(`Error is found ${error}`, {
          extensions: {
            code: `ERROR_FOUND_${error}`,
          },
        });
      }
    },
    deleteCart: async (_, args, context) => {
    //   console.log(args);
      try {
        const deleteCartId = await Cart.findById(args.id);
        if (!deleteCartId) {
          throw new GraphQLError("Cart not found", {
            extensions: {
              code: "CART_NOT_FOUND",
            },
          });
        }else{

            const deletedCartItem = await Cart.findByIdAndDelete(args.id).populate('item.productId');
            return deletedCartItem;
        }

      } catch (error) {
        throw new GraphQLError(`Error is found ${error}`, {
          extensions: {
            code: `ERROR_FOUND_${error}`,
          },
        });
      }
    },
  },
};

export default cartResolvers;

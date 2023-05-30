import { GraphQLError } from "graphql";
import Order from "../model/order.js";
import User from "../model/user.js";
const orderResolvers = {
  // Order: {
  //   customer: async (parent) => {
  //     console.log(parent);
  //     const order=await Order.findById(parent.id).populate('customer');
  //     console.log(order);
  //     return order;
  //    },
  // },
  Query: {
    getAllOrder: async () => {
      try {
        const res = await Order.find().populate("customer");

        // console.log(res);
        return res;
      } catch (error) {
        throw new GraphQLError(`Error ${error}`, {
          extensions: {
            code: `ERROR ${error}`,
          },
        });
      }
    },
    getOrder: async (_, args, context) => {
      const orderId = await Order.findById(args.id);
      //  console.log(orderId);
      if (!orderId) {
        throw new GraphQLError("OrderID not found ", {
          extensions: {
            code: "ORDER_ID IS NOT FOUND",
          },
        });
      } else {
        return orderId;
      }
    },
  },
  Mutation: {
    createOrder: async (_, args, context) => {
      console.log(args);
      try {
        const orderId = await Order.findById(args.id);
        // console.log(orderId);
        if (orderId) {
          throw new GraphQLError("Order is already created", {
            extensions: {
              code: "ORDER ALREADY CREATED",
            },
          });
        } else {
          const newOrder = new Order({
            orderNumber: args.input.orderNumber,
            totalAmount: args.input.totalAmount,
          });
          const res = await newOrder.save();
          //  console.log(res);
          return {
            id: res.id,
            ...res._doc,
          };
        }
      } catch (error) {
        console.log(error);
        throw new GraphQLError(`Error ${error}`, {
          extensions: {
            code: "ERROR",
          },
        });
      }
    },
    updateOrder: async (_, args, context) => {
      console.log(args);
      const orderID = await Order.findById(args.id);
      if (!orderID) {
        throw new GraphQLError("Order is Not Found", {
          extensions: {
            code: "ORDER IS NOT FOUND",
          },
        });
      } else {
        const updateOrder = await Order.findByIdAndUpdate(args.id, args.input, {
          new: true,
        });
        // console.log(updateOrder);
        return updateOrder;
      }
    },
    deleteOrder: async(_,args,context)=>{
      console.log(args);
      const OrderID= await Order.findById(args.id);
      if(!OrderID){
        throw new GraphQLError("Order is Not Found",{extensions:{
          code:'ORDER IS NOT FOUND'
        }})
      }else{
        const deletedOrder= await Order.findByIdAndDelete(args.id);
        console.log(deletedOrder);
        return deletedOrder;
      }
    }
  },
};

export default orderResolvers;

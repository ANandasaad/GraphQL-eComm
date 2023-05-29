import { GraphQLError } from "graphql";
import Order from "../model/order.js";
const orderResolvers = {
  Query: {
    getAllOrder: async () => {
      try {
        const res = await Order.find()
          .populate("customer")
          .populate("products");
        console.log(res);
        return res;
      } catch (error) {
        throw new GraphQLError(`Error ${error}`, {
          extensions: {
            code: `ERROR ${error}`,
          },
        });
      }
    },
    getOrder: async (_,args,context)=>{
         const orderId= await Order.findById(args.id);
         console.log(orderId);
         if(!orderId)
         {
            throw new GraphQLError("OrderID not found ",{extensions:{
                code:"ORDER_ID IS NOT FOUND"
            }})
         }
         else{
             return orderId;
         }
    },
    
  },
  Mutation:{
    createOrder:async(_,args,context)=>{
        console.log(args);
        //  const customerID= await Order.findById(args.id);
        //  if(!customerID)
        //  {
        //     throw new GraphQLError("Customer ID is already exits",{extensions:{
        //         code:"CUSTOMER ID IS ALREADY EXIST"
        //     }})
        //  }
        //  else{

        //  }
       
    }
  }
};

export default orderResolvers;

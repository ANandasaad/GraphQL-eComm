import { GraphQLError } from "graphql";
import Payment from "../model/payment.js";
import Order from "../model/order.js";
const paymentResolvers = {
    // Payment: {
    //     orderId: async (parent) => {
    //       console.log("hit");
    //       console.log(parent);
    //         if (!parent.orderId) {
    //           return null; // or throw an error if necessary
    //         }
    //         try {
    //           const order = await Order.findById(parent.orderId);
              
    //           return order;
    //         } catch (error) {
    //           throw new Error(`Error fetching order for payment: ${error.message}`);
    //         }
    //       },
          
    //   },
    
  Query: {
    getAllPayment: async () => {
        try {
          const payments = await Payment.find().populate({path:'orderId',populate:{
            path:'customer'
          }});
          console.log(payments)
         
          return payments || []; // Return an empty array if no payments are found

        } catch (error) {
          throw new GraphQLError(`Error retrieving payments: ${error.message}`);
        }
      },
      
    getPaymentID: async (_, args, context) => {
      try {
      
        const paymentId = await Payment.findById(args.id).populate("orderId");
        if (!paymentId) {
          throw new GraphQLError("Payment id is not found", {
            extensions: {
              code: "PAYMENT_ID_NOT_FOUND",
            },
          });
        } else {
          console.log(paymentId);
          return paymentId;
        }
      } catch (error) {
        throw new GraphQLError(`Error_${error}`, {
          extensions: {
            code: `ERROR_${error}`,
          },
        });
      }
    },
  },
  Mutation: {
    makePayment: async (_, args, context) => {
      console.log(args);
      try {
        const { orderId, amount, paymentMethod ,paymentStatus} = args.input;
        console.log("hit");
        const order = await Payment.findOne({ orderId }).populate("orderId");
        console.log(order);
        console.log('end');
        if (order) {
          throw new GraphQLError("Payment is already done", {
            extensions: {
              code: "PAYMENT_ALREADY_DONE",
            },
          });
        } else {
          const newPayment = new Payment({
            orderId,
            amount,
            paymentMethod,
            paymentStatus
          });
          const res = await newPayment.save();
          return {
            id: res.id,
            ...res._doc
          };
        }
      } catch (error) {
        throw new GraphQLError(`Error_${error}`, {
          extensions: {
            code: `ERROR_${error}`,
          },
        });
      }
    },
    updatePayment: async (_, args, context) => {
      try {
        const { amount, paymentMethod, paymentStatus } = args.input;
        const existingPayment = await Payment.findById(args.id);
        if (!existingPayment) {
          throw new GraphQLError("Payment Id not found", {
            extensions: {
              code: "PAYMENT_ID_NOT_FOUND",
            },
          });
        } else {
          console.log(existingPayment);
          const updatedPayment = await Payment.findByIdAndUpdate(
            args.id,
            args.input,
            { new: true }
          ).populate({path:'orderId',populate:{path:'customer'}});
          return updatedPayment;
        }
      } catch (error) {
        throw new GraphQLError(`Error_${error}`, {
          extensions: {
            code: `ERROR_${error}`,
          },
        });
      }
    },
    deletePayment :async (_,args,context)=>{

      try {
        const isPaymentExist= await Payment.findById(args.id);
        if(isPaymentExist)
        {
          const delPayment= await Payment.findByIdAndDelete(args.id).populate({path:'orderId',populate:{path:'customer'}});
          return delPayment;
        }
        else
        {
          throw new GraphQLError('Payment not found',{extensions:{
            code:'PAYMENT_NOT_FOUND'
          }})
        }
      } catch (error) {
        throw new GraphQLError(`Error_${error}`,{extensions:{
          code:`ERROR_${error}`
        }})
      }

    }
  },
};
export default paymentResolvers;

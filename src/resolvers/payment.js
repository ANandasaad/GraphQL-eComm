import { GraphQLError } from "graphql";
import Payment from "../model/payment.js";
import Order from "../model/order.js";
const paymentResolvers = {
    Payment: {
        orderId: async (parent) => {
            if (!parent.orderId) {
              return null; // or throw an error if necessary
            }
            try {
              const order = await Order.findById(parent.orderId);
              return order;
            } catch (error) {
              throw new Error(`Error fetching order for payment: ${error.message}`);
            }
          },
          
      },
    
  Query: {
    getAllPayment: async () => {
        try {
          const payments = await Payment.find().populate("orderId");
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
        const { orderId, amount, paymentMethod } = args.input;
        console.log("hit");
        const order = await Payment.findOne({ orderId }).populate("orderId");
        console.log(order);
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
          });
          const res = await newPayment.save();
          return {
            id: res.id,
            ...res._doc,
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
          ).populate("orderId");
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
  },
};
export default paymentResolvers;

import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import mongoose from "mongoose";
import userResolvers from "./resolvers/users.js";
import typeDefs from "./typeDefs/typeDefs.js";
import orderResolvers from "./resolvers/order.js";
import productResolvers from "./resolvers/product.js";
import pkg from "lodash";
import { getUser } from "./utils/context.js";
import inventoryResolvers from "./resolvers/inventory.js";
import reviewResolvers from "./resolvers/review.js";
import categoryResolver from "./resolvers/category.js";
import orderItemResolvers from "./resolvers/orderItem.js";
import cartResolvers from "./resolvers/cart.js";
import dotenv from 'dotenv';
import paymentResolvers from "./resolvers/payment.js";
import { GraphQLError } from "graphql";
import adminResolvers from "./resolvers/admin.js";

dotenv.config();


const { merge } = pkg;

const resolvers = merge(
  userResolvers,
  productResolvers,
  orderResolvers,
  inventoryResolvers,
  reviewResolvers,
  categoryResolver,
  orderItemResolvers,
  cartResolvers,
  paymentResolvers,
  adminResolvers
);

console.log(process.env.SECRET__KEY);

const server = new ApolloServer({
  typeDefs,
  resolvers,

});
mongoose
  .connect(process.env.MONGODB__URL, { useNewUrlParser: true })
  .then(() => {
    console.log("MongoDB is connected successfully");
    return startStandaloneServer(server, {
      context:async ({req,res})=>{
        try {

          const token = req.headers.authorization || " ";
          
          // Check if the token exists
   if (!token) {
     throw new Error('Missing authentication token');
   }
       const user=  await  getUser(token);
       console.log("user");
       console.log(user);
       if(!user)
       {
          throw new GraphQLError('User is not authenicated',{extensions:{
           code: 'UNAUTHENTICATED',
           http: { status: 401 },
          }})
       }
       return {user}
          
        } catch (error) {
          console.log(error)
        }
        
        
      },
      listen: {
        port: 4000,
      },
    });
  })
  .then((res) => {
    console.log("Server is running at " + res.url);
  })
  .catch((error) => {
    console.log(error);
  });

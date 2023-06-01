import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import mongoose from "mongoose";
import { MONGODB_URL, SECRET_KEY } from "./config.js";
import userResolvers from "./resolvers/users.js";
import typeDefs from "./typeDefs/typeDefs.js";
import orderResolvers from "./resolvers/order.js";
import productResolvers from "./resolvers/product.js";
import pkg from "lodash";
import jwt from "jsonwebtoken";
import User from "./model/user.js";
import { GraphQLError } from "graphql";
import context from "./utils/context.js";
import inventoryResolvers from "./resolvers/inventory.js";
import reviewResolvers from "./resolvers/review.js";
const { merge } = pkg;

const resolvers = merge(
  userResolvers,
  productResolvers,
  orderResolvers,
  inventoryResolvers,
  reviewResolvers
);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: context,
});

mongoose
  .connect(MONGODB_URL, { useNewUrlParser: true })
  .then(() => {
    console.log("MongoDB is connected successfully");
    return startStandaloneServer(server, {
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

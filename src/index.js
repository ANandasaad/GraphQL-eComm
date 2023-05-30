import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from '@apollo/server/standalone';
import mongoose from "mongoose";
import { MONGODB_URL } from "./config.js";
import userResolvers from "./resolvers/users.js";
import typeDefs from "./typeDefs/typeDefs.js";
import orderResolvers from "./resolvers/order.js";
import productResolvers from "./resolvers/product.js";
import pkg from "lodash";
const {merge}=pkg;

const resolvers=merge(userResolvers,productResolvers,orderResolvers)

const server = new ApolloServer({
    typeDefs,
    resolvers
});

mongoose.connect(MONGODB_URL, { useNewUrlParser: true })
    .then( () => {
        console.log("MongoDB is connected successfully");
        return startStandaloneServer(server, {
            listen: {
                port: 4000
            }
        });
    })
    .then((res) => {
        console.log("Server is running at " + res.url);
    })
    .catch((error) => {
        console.log(error);
    });

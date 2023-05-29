
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from '@apollo/server/standalone';
import mongoose from "mongoose";
import { MONGODB_URL } from "./config.js";
import userResolvers from "./resolvers/users.js";
import typeDefs from "./typeDefs/typeDefs.js";
import productResolvers from "./resolvers/product.js";

const resolvers={
    ...userResolvers,
    ...productResolvers
 
   

}

const server= new ApolloServer({
    typeDefs,
    resolvers
})

mongoose.connect(MONGODB_URL,{useNewUrlParser:true}).then(()=>{
     console.log("Mongodb is connected Successfully")
     return startStandaloneServer(server,{
        listen:{
            port:4000,
        }
     });
}).then((res)=>{
    console.log('Server is running at'+ res.url);
}).catch((error)=>{
    console.log(error);
})




import gql from "graphql-tag";
 import userTypeDefs from "./userTypeDefs.js";
import productTypeDefs from "./productTypeDefs.js";
import orderTypeDefs from "./orderTyDefs.js";
const typeDefs=gql`
  ${userTypeDefs},
  ${productTypeDefs},
  ${orderTypeDefs}
  

`

export default typeDefs;
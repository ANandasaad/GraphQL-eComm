
import gql from "graphql-tag";
 import userTypeDefs from "./userTypeDefs.js";
import productTypeDefs from "./productTypeDefs.js";
const typeDefs=gql`
  ${userTypeDefs},
  ${productTypeDefs}
  

`

export default typeDefs;
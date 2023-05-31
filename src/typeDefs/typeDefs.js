
import gql from "graphql-tag";
 import userTypeDefs from "./userTypeDefs.js";
import productTypeDefs from "./productTypeDefs.js";
import orderTypeDefs from "./orderTyDefs.js";
import inventoryTypeDefs from "./inventory.js";
const typeDefs=gql`
  ${userTypeDefs},
  ${productTypeDefs},
  ${orderTypeDefs},
  ${inventoryTypeDefs}
  

`

export default typeDefs;
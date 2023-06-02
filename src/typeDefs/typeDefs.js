
import gql from "graphql-tag";
 import userTypeDefs from "./userTypeDefs.js";
import productTypeDefs from "./productTypeDefs.js";
import orderTypeDefs from "./orderTyDefs.js";
import inventoryTypeDefs from "./inventory.js";
import reviewTypeDefs from "./reviewTypeDef.js";
import categoryTypeDefs from "./categoryTypeDefs.js";
import orderItemTypeDefs from "./orderItemTypeDefs.js";
import cartTypeDefs from "./cartTypeDefs.js";
const typeDefs=gql`
  ${userTypeDefs},
  ${productTypeDefs},
  ${orderTypeDefs},
  ${inventoryTypeDefs},
  ${reviewTypeDefs},
  ${categoryTypeDefs},
  ${orderItemTypeDefs},
  ${cartTypeDefs}
  

`

export default typeDefs;
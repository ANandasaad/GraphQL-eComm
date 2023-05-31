
import gql from "graphql-tag";

const inventoryTypeDefs=gql`
    type Inventory{
       id:ID!
       name:String!
       location:String!
    }
    type Query{
     getAllInventory:[Inventory!]!
     getInventory(id:ID!):Inventory!
    }
    type Mutation{
      createInventory(input:createInventoryInput):Inventory!
      updateInventory(id:ID!,input:updateInventoryInput):Inventory!
      deleteInventory(id:ID!):Inventory!
    }

    input createInventoryInput{
       name:String!,
       location:String!
    }
    input updateInventoryInput{
        name:String!
        location:String!
    }
`

export default inventoryTypeDefs;

import gql from "graphql-tag";

const inventoryTypeDefs=gql`
    type Inventory{
       id:ID!
       name:String!
       location:String!
       product:[Product]!
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

    input productInput{
        name:String!
        description:String!
        price:String!
        category:String!
    }

    input createInventoryInput{
       name:String!,
       location:String!
       product:[productInput!]!
    }
    input updateInventoryInput{
        name:String!
        location:String!
    }
`

export default inventoryTypeDefs;
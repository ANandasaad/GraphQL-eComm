
import gql from "graphql-tag";


const productTypeDefs=gql`
   scalar Date
  type Product{
   id:ID!
   name:String!
   description:String!
   price:String!
   category:String!
   createAt:Date!
  }

  type Query{
   getAllProduct:[Product!]!
   getProduct(id:ID!):Product!
  }

  type Mutation {
   createProduct(input:createProductInput!):Product!
   updateProduct(id:ID!,input:updateProduct):Product!
   deleteProduct(id:ID!):Product!
  }

  input createProductInput{
   name:String!
   description:String!
   price:String!
   category:String!
  
  }
  input updateProduct{
    name:String!
   description:String!
   price:String!
   category:String!
  }

`

export default productTypeDefs;
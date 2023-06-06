import gql from "graphql-tag";

const adminTypeDefs=gql`
   type Admin{
      id:ID!
      username:String!
      password:String!
      email:String!
      token:String!
      role:String!
   }

   type Query{
    getAdmin(id:ID!):Admin!
   }

   type Mutation{
    createAdmin(input:createAdminInput):Admin!
    updateAdmin(id:ID!,input:updateAdminInput):Admin!
    deleteAdmin(id:ID!):Admin!
    loginAdmin(input:loginAdminInput):Admin!
    
   }
   
   input loginAdminInput{
     username:String!
     password:String!
   }


   input createAdminInput{
     username:String!
     email:String!
     password:String!
     confirmPassword:String!
     role:String!
   }

   input updateAdminInput{
    username:String!
     email:String!
     password:String!
     confirmPassword:String!
   }

`

export default adminTypeDefs;
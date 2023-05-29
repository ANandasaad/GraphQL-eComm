import gql from "graphql-tag";

const userTypeDefs=gql`
    type User{
    id:ID!
    name:String!,
    username:String!,
    email:String!
    }

    type Query{
    getAllUser:[User!]!
    getUser(id:ID!):User!
    }

    type Mutation {
    createUser(input:createUserInput!):User!
    updateUser(id:ID!,input:updateUserInput):User!
    deleteUser(id:ID!):User!
    }

    input createUserInput{
     name:String!,
     username:String!,
     email:String!
    }
    input updateUserInput{
      name:String!,
      username:String!,
      email:String!
    }
`

export default userTypeDefs;
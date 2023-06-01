import gql from "graphql-tag";
const orderTypeDefs = gql`
  scalar Date
  type Order {
    id: ID!
    orderNumber: String!
    customer: [User]!
    totalAmount: Float!
    customerID:String!
    createAt: Date
  }

  type Query {
    getAllOrder: [Order!]!
    getOrder(id: ID!): Order!
  }

  type Mutation {
    createOrder(input: createOrderInput): Order!
    updateOrder(id: ID!, input: updateOrderInput): Order!
    deleteOrder(id:ID!):Order!
  }


  input createOrderInput {
    orderNumber: String!
    customerID:ID! 
    totalAmount: Float!
  }
  input updateOrderInput {
    orderNumber: String!
    totalAmount: Float!
  }
`;

export default orderTypeDefs;

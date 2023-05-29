import gql from "graphql-tag";
const orderTypeDefs = gql`
  scalar Date
  type Order {
    id: ID!
    customer: User!
    products: [Product!]!
    total: Float!
    createdAt: Date!
  }

  type Query {
    getAllOrder: [Order!]!
    getOrder(id: ID!): Order!
  }

  type Mutation {
    createOrder(input: createOrderInput): Order!
    updateOrder(id: ID!, input: updateOrderInput): Order!
    deleteOrder(id: ID!): Order!
  }

  input createOrderInput {
    customerID: ID!
    productIDs: [ID!]!
    total:Float!
  }

  input updateOrderInput {
    customerID: ID!
    total: Float!
  }
`;

export default orderTypeDefs;

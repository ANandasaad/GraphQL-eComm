import gql from "graphql-tag";

const cartTypeDefs = gql`
  scalar Date
  type CartItem {
    productId: Product!
    quantity: Int!
    price: Float!
  }
  type Cart {
    id: ID!
    userId: User!
    item: [CartItem]!
    total: Float!
    createdAt: Date!
  }
  type Query {
    getAllCartItem: [Cart]!
    getCartItem(id: ID!): Cart!
  }

  type Mutation {
    addToCart(input: addToCartInput): Cart!
    updateCart(id: ID!, input: updateCartInput): Cart!
    deleteCart(id: ID!): Cart!
  }

  input addToCartInput {
    userId: ID!
    productId: ID!
    quantity: Int!
    price: Float!
  }
  input updateCartInput {
    productId: ID!
    quantity: Int!
    price: Float!
  }
`;

export default cartTypeDefs;

import gql from "graphql-tag";

const paymentTypeDefs = gql`
  scalar Date
  type Payment {
    id: ID!
    orderId: Order!
    amount: Float!
    paymentMethod: String!
    paymentStatus: PaymentStatus!
    createdAt: Date!
  }
  enum PaymentStatus {
    PENDING
    COMPLETED
    FAILED
  }

  type Query {
    getAllPayment: [Payment]!
    getPaymentID(id: ID!): Payment!
  }

  type Mutation {
    makePayment(input: makePaymentInput): Payment!
    updatePayment(id: ID!, input: updatePaymentInput): Payment!
    deletePayment(id: ID!): Payment!
  }

  input makePaymentInput {
    orderId: ID!
    amount: Float!
    paymentMethod: String!
    paymentStatus:PaymentStatus!
  }

  input updatePaymentInput {
    amount: Float!
    paymentMethod: String!
    paymentStatus: PaymentStatus!
  }
`;

export default paymentTypeDefs;

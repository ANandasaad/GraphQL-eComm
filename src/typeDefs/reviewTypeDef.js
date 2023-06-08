import gql from "graphql-tag";

const reviewTypeDefs = gql`
  scalar Date
  type Review {
    id: ID!
    userId: User!
    productId: Product!
    rating: Float!
    comment: String!
    createdAt: Date
  }

  type Query {
    getAllReview(input:ratingInput): [Review!]!
    getReview(id: ID!): Review!
  }
  input ratingInput{
    rating:Float!
  }

  type Mutation {
    createReview(input: createReviewInput): Review!
    updateReview(id: ID!, input: updateReviewInput): Review!
    deleteReview(id: ID!): Review!
  }

  input createReviewInput {
    userId: ID!
    productId: ID!
    rating: Float!
    comment: String!
  }
  input updateReviewInput {
    rating: Float!
    comment: String!
  }
`;

export default reviewTypeDefs;

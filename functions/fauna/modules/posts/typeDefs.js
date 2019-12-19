const { gql } = require("apollo-server-lambda");

module.exports = gql`
  scalar Date

  type PaginateResponse {
    data: [Post!]
    after: String
    before: String
    perPage: Int!
  }

  extend type Query {
    allPosts(after: String, perPage: Int!): PaginateResponse!
    getPost(id: String!): Post
  }

  type PostLocation {
    postId: String!
    country: String!
    province: String!
    city: String!
    postalCode: String!
    lon: Float!
    lat: Float!
  }

  type Post {
    id: ID!
    uuid: String!
    title: String!
    description: String!
    authorId: String!
    tags: [String!]
    images: [String!]
    active: Boolean!
    priceInfo: String!
    price: Float
    address: String
    latitude: Float!
    longitude: Float!
    createdAt: String!
    updatedAt: String!
    author: User!
  }

  type S3Payload {
    url: String!
    signedRequest: String!
  }

  extend type Mutation {
    createPost(
      title: String!
      description: String!
      images: [String!]
      tags: [String!]
      priceInfo: String!
      price: Float
      address: String!
      latitude: Float!
      longitude: Float!
    ): Boolean!
    updatePost(id: String!, title: String!, description: String!): Boolean!
    deletePost(id: String!): Boolean!
    signS3(filename: String!, filetype: String!): S3Payload!
  }
`;

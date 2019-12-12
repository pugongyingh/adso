import gql from "graphql-tag";

export const SIGN_S3 = gql`
  mutation signS3($filename: String!, $filetype: String!) {
    signS3(filename: $filename, filetype: $filetype) {
      url
      signedRequest
    }
  }
`;

export const CREATE_POST = gql`
  mutation CreatePost(
    $title: String!
    $description: String!
    $images: [String!]
    $tags: [String!]
    $priceInfo: String!
    $price: Float
    $address: String!
    $latitude: Float!
    $longitude: Float!
  ) {
    createPost(
      title: $title
      description: $description
      images: $images
      tags: $tags
      priceInfo: $priceInfo
      price: $price
      address: $address
      latitude: $latitude
      longitude: $longitude
    )
  }
`;

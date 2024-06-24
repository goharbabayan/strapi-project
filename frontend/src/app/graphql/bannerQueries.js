import { gql } from '@apollo/client';

const GET_BANNER_QUERIES = gql`
  query {
    homePage {
      data {
        attributes {
          Banner {
            title
            description
            image {
              data {
                attributes {
                  url
                  alternativeText
                  name
                  width
                }
              }
            }
          }
        }
      }
    }
  }
`;

export { GET_BANNER_QUERIES };

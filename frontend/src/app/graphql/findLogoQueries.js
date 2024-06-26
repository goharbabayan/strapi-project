import { gql } from '@apollo/client';

const GET_LOGO_QUERIES = gql`
  query {
    homePage {
      data {
        attributes {
          Header {
            logo {
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

export { GET_LOGO_QUERIES };

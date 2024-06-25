import { gql } from '@apollo/client';

const GET_HEADER_QUERIES = gql`
  query {
    homePage {
      data {
        attributes {
          Header {
            menuItem1
            menuItem2
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
            Button {
              id
              title
              type
              link
            }
          }
        }
      }
    }
  }
`;

export { GET_HEADER_QUERIES };

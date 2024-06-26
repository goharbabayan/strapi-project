import { gql } from '@apollo/client';

const GET_HEADER_QUERIES = gql`
  query {
    homePage {
      data {
        attributes {
          Header {
            menuItem1
            menuItem2
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

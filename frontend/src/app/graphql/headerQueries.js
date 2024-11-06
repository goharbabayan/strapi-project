import { gql } from '@apollo/client';

const GET_HEADER_QUERIES = gql`
  query {
    header {
      data {
        attributes {
          logo {
            data {
              attributes {
                alternativeText
                url
                width
                height
              }
            }
          }
          locations {
            id
            title
            locations {
              id
              name
              link
            }
          }
          buttons {
            id
            title
            link
          }
        }
      }
    }
  }
`;

export { GET_HEADER_QUERIES };

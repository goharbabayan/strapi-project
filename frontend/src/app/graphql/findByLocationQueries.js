import { gql } from '@apollo/client';

const GET_BY_LOCATION_QUERIES = gql`
  query GetByLocation {
    home {
      data {
        attributes {
          Find_by_location {
            heading
            card {
              url
              badge
              image {
                data {
                  attributes {
                    url
                    name
                    alternativeText
                    height
                    width
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export { GET_BY_LOCATION_QUERIES };

import { gql } from '@apollo/client';

const GET_BY_LOCATION_QUERIES = gql`
  query GetByLocation {
    homePage {
      data {
        attributes {
          ByLocations {
            heading
            activateBlackMode
            ...on ComponentSectionFindByLocation {
              card {
                url
                badge
                image {
                  data {
                    attributes {
                      url
                    }
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

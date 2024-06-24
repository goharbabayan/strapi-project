import { gql } from '@apollo/client';

const GET_FIND_BY_TYPE_QUERIES = gql`
  query GetByTypeData {
    homePage {
      data {
        attributes {
          FindByType {
            title
            ...on ComponentSectionFindByType {
              type {
                text
                link
              }
              card {
                badge
                name
                location
                cost
                image {
                  data {
                    attributes {
                      url
                    }
                  }
                }
              }
              activateBlackMode
            }
          }
        }
      }
    }
  }
`;

export { GET_FIND_BY_TYPE_QUERIES };

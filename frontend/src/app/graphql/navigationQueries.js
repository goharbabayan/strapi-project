
import { gql } from '@apollo/client';

const GET_NAVIGATION_QUERIES = gql`
  query {
    navigation {
      data {
        attributes {
          navigation_items {
            data {
              attributes {
                title
                link
                level_2 {
                  id
                  title
                  link
                  level_3 {
                    id
                    title
                    link
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

export { GET_NAVIGATION_QUERIES };

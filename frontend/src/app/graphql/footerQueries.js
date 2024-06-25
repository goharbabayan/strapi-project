import { gql } from '@apollo/client';

const GET_FOOTER_QUERIES = gql`
  query GetFooter {
    homePage {
      data {
        attributes {
          Footer {
            info
            text
            link {
              redirection_url
            }
            menu_items(pagination: { start: 0, limit: 50 }) {
              data {
                attributes {
                  item
                  redirection_url
                }
              }
            }
          }
        }
      }
    }
  }
`;

export { GET_FOOTER_QUERIES };

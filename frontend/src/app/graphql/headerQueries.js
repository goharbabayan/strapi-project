import { gql } from '@apollo/client';

const GET_HEADER_QUERIES = gql `
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
          announcement_bar {
            id
            title
            announcement_bar_links(pagination: {limit: 14}) {
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

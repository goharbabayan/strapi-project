import { gql } from '@apollo/client';

const GET_FOOTER_QUERIES = gql`
  query {
    footer {
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
          description
          navigation(pagination: { limit: 20}) {
            data {
              attributes {
                name
                url
              }
            }
          }
        }
      }
    }
  }
`;

export { GET_FOOTER_QUERIES };

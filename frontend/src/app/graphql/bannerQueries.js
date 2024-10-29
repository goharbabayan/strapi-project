import { gql } from '@apollo/client';

const GET_BANNER_QUERIES = gql`
  query {
    home {
      data {
        attributes {
          Banner {
            link
            heading
            Button {
              title
              link
            }
            image_for_desktop {
              data {
                attributes {
                  url
                  alternativeText
                  name
                  width
                  height
                }
              }
            }
            image_for_mobile {
              data {
                attributes {
                  url
                  alternativeText
                  name
                  width
                  height
                }
              }
            }
          }
        }
      }
    }
  }
`;

export { GET_BANNER_QUERIES };

import { gql } from '@apollo/client';

const GET_ABOUT_US_PAGE_QUERIES = gql`
  query {
      aboutUs {
        data {
          attributes {
            content {
              heading
              text
            }
            hero_image_landscape_for_mobile {
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
            hero_image_portrait_for_desktop {
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
`;

export { GET_ABOUT_US_PAGE_QUERIES };

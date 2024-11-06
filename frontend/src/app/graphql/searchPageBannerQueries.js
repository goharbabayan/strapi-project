import { gql } from "@apollo/client";

const GET_SEARCH_PAGE_BANNER_QUERIES = gql`
  query {
    search {
      data {
        attributes {
          image_banner_landscape_for_desktop {
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
          image_banner_portrait_for_mobile {
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

export { GET_SEARCH_PAGE_BANNER_QUERIES };

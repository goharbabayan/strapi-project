import { gql } from "@apollo/client";

const GET_LOCATION_PAGE_QUERIES = gql`
  query GetLocationByHandle($handle: String!) {
    locations(filters: { handle: { eq: $handle }}) {
      data {
        attributes {
          handle
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

export { GET_LOCATION_PAGE_QUERIES };

import { gql } from "@apollo/client";

const GET_ALL_TUTORS_QUERIES = gql`
  query GetAllTutors {
    locations {
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

export { GET_ALL_TUTORS_QUERIES };

import { gql } from "@apollo/client";

const GET_CLIENT_DASHBOARD_PAGE_QUERIES = gql`
  query {
    clientDashboardPage {
      data {
        attributes {
          title
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
`;

export { GET_CLIENT_DASHBOARD_PAGE_QUERIES };

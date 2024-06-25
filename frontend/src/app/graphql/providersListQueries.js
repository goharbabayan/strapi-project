import { gql } from '@apollo/client';

const GET_PROVIDERS_LIST_QUERIES = gql`
  query GetProvidersData {
    homePage {
      data {
        attributes {
          Slider1 {
            ...on ComponentSectionSlider {
              title
              activateBlackMode
              card {
                ...on ComponentBlockServiceProviderCard {
                  badge
                  image {
                    data {
                      attributes {
                        url
                        alternativeText
                      }
                    }
                  }
                  
                  cost
                  location
                  name
                }
              }
            }
          }
        }
      }
    }
  }
`;

export { GET_PROVIDERS_LIST_QUERIES };

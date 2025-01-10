import { gql } from '@apollo/client';

const GET_CONFIRMATION_POPUP_INFO = gql`
  query {
    ageConfirmationPopUp {
      data {
        attributes {
          heading
          logo {
            data {
              attributes {
                url
                width
                height
                alternativeText
              }
            }
          }
          description
        }
      }
    }
  }
`;

export { GET_CONFIRMATION_POPUP_INFO };

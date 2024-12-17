import { gql } from '@apollo/client';

const GET_FAQ_PAGE_QUERIES = gql`
  query FAQ {
    faq {
      data {
        attributes {
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
          Info {
            title
            text
          }
          QuestionsAndAnswers {
            title
            text
          }
        }
      }
    }
  }
`

export { GET_FAQ_PAGE_QUERIES };

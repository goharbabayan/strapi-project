import { gql } from '@apollo/client';

const GET_FAQ_PAGE_QUERIES = gql`
  query FAQ {
    faq {
      data {
        attributes {
          ImageBanner {
            image {
              data {
                attributes {
                  alternativeText
                  name
                  url
                  height
                  width
                }
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

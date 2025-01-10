
import { gql } from '@apollo/client';

export const GET_BLOG_PAGE_QUERY = gql`
  query {
    blog {
      data {
        attributes {
          blog_title
          Image_for_mobile {
            data {
              attributes {
                url
                height
                width
              }
            }
          }
          Image_for_desktop {
            data {
              attributes {
                url
                height
                width
              }
            } 
          }
        }
      }
    }
  }
`

export const GET_ARTICLES_QUERY = gql`
  query getArticles($page: Int, $pageSize: Int) {
    articles(pagination: {page: $page, pageSize: $pageSize}) {
      data {
        id
        attributes {
          content
          heading
          publishedAt
          heroImage {
            data {
              attributes {
                url
                height
                width
              }
            }
          }
        }
      }
      meta {
        pagination {
          page
          total
          pageSize
          pageCount
        }
      }
    }
  }
`

export const GET_ARTICLE_QUERY = gql`
  query getArticle($id: ID!) {
    article (id: $id){
      data {
        id
        attributes {
          content
          heading
          heroImage {
            data {
              attributes {
                url
                height
                width
              }
            }
          }
          related_articles {
            data {
              id
              attributes {
                content
                heading
                publishedAt
                heroImage {
                  data {
                    attributes {
                      url
                      height
                      width
                    }
                 }
                }
              }
            }
          }
        }
      }
    }
  }
`

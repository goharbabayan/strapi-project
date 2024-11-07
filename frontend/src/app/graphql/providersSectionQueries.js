import { gql } from '@apollo/client';

const GET_POPULAR_PROVIDERS_QUERIES = gql`
  query {
    home {
      data {
        attributes {
          Popular_Providers {
            heading
            providers {
              data {
                id
                attributes {
                  username
                  name
                  lastName
                  age
                  placeOfService
                  dressSize
                  hairColor
                  isApprovedByAdmin
                  badge
                  role {
                    data {
                      attributes {
                        type
                      }
                    }
                  }
                  incallRates {
                    id
                    duration
                    price
                    additionalInfo
                  }
                  outcallRates {
                    id
                    duration
                    price
                    additionalInfo
                  }
                  profilePicture {
                    data {
                      attributes {
                        name
                        alternativeText
                        width
                        height
                        url
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
  }
`;

const GET_TOP_PROVIDERS_QUERIES = gql`
  query {
    home {
      data {
        attributes {
          Top_Providers {
            heading
            providers {
              data {
                id
                attributes {
                  username
                  name
                  lastName
                  age
                  placeOfService
                  dressSize
                  hairColor
                  badge
                  isApprovedByAdmin
                  role {
                    data {
                      attributes {
                        type
                      }
                    }
                  }
                  incallRates {
                    id
                    duration
                    price
                    additionalInfo
                  }
                  outcallRates {
                    id
                    duration
                    price
                    additionalInfo
                  }
                  profilePicture {
                    data {
                      attributes {
                        name
                        alternativeText
                        width
                        height
                        url
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
  }
`;

const GET_PROVIDERS_BY_TYPE_QUERIES = gql`
  query {
    home {
      data {
        attributes {
          Find_By_Type {
            heading
            show_categories_in_the_center
            categories {
              name
              link
              id
            }
            providers (pagination: { pageSize: 12 }) {
              data {
                id
                attributes {
                  username
                  name
                  lastName
                  age
                  placeOfService
                  dressSize
                  hairColor
                  badge
                  isApprovedByAdmin
                  role {
                    data {
                      attributes {
                        type
                      }
                    }
                  }
                  incallRates {
                    id
                    duration
                    price
                    additionalInfo
                  }
                  outcallRates {
                    id
                    duration
                    price
                    additionalInfo
                  }
                  profilePicture {
                    data {
                      attributes {
                        name
                        alternativeText
                        width
                        height
                        url
                      }
                    }
                  }
                }
              }
            }
            Button {
              title
              link
            }
          }
        }
      }
    }
  }
`;

export { GET_POPULAR_PROVIDERS_QUERIES, GET_TOP_PROVIDERS_QUERIES, GET_PROVIDERS_BY_TYPE_QUERIES };

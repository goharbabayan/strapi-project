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
                  verificationStatus {
                    hasBronzeBadge
                    hasSilverBadge
                    hasGoldBadge
                  }
                  role {
                    data {
                      attributes {
                        type
                      }
                    }
                  }
                  incall {
                   general {
                      id
                      duration
                      price
                      additionalInfo
                    	}
                   	GFE {
                       id
                      duration
                      price
                      additionalInfo
                      }
                    PSE {
                     id
                    duration
                    price
                    additionalInfo
                    }
                  }
                  outcall {
                    general {
                      id
                      duration
                      price
                      additionalInfo
                    	}
                   	GFE {
                       id
                      duration
                      price
                      additionalInfo
                      }
                    PSE {
                     id
                    duration
                    price
                    additionalInfo
                    }
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
                  verificationStatus {
                    hasBronzeBadge
                    hasSilverBadge
                    hasGoldBadge
                  }
                  role {
                    data {
                      attributes {
                        type
                      }
                    }
                  }
                  incall {
                   general {
                      id
                      duration
                      price
                      additionalInfo
                    	}
                   	GFE {
                       id
                      duration
                      price
                      additionalInfo
                      }
                    PSE {
                     id
                    duration
                    price
                    additionalInfo
                    }
                  }
                  outcall {
                    general {
                      id
                      duration
                      price
                      additionalInfo
                    	}
                   	GFE {
                       id
                      duration
                      price
                      additionalInfo
                      }
                    PSE {
                     id
                    duration
                    price
                    additionalInfo
                    }
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
                  verificationStatus {
                    hasBronzeBadge
                    hasSilverBadge
                    hasGoldBadge
                  }
                  role {
                    data {
                      attributes {
                        type
                      }
                    }
                  }
                  incall {
                   general {
                      id
                      duration
                      price
                      additionalInfo
                    	}
                   	GFE {
                       id
                      duration
                      price
                      additionalInfo
                      }
                    PSE {
                     id
                    duration
                    price
                    additionalInfo
                    }
                  }
                  outcall {
                    general {
                      id
                      duration
                      price
                      additionalInfo
                    	}
                   	GFE {
                       id
                      duration
                      price
                      additionalInfo
                      }
                    PSE {
                     id
                    duration
                    price
                    additionalInfo
                    }
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

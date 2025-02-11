// // fetch users with services and rates , passing variable city
// export const GET_USERS_BY_FILTER_OPTIONS_QUERIES = `
//   query GetProviders(
//     $city: [String]
//     $name: String
//     $lastName: String
//     $suburbs: [String]
//     $gender: [String]
//     $services: [String]
//     $hairColor: [String]
//     $age: [String]
//     $eyeColor: [String]
//     $bodyType: [String]
//     $bust: [String]
//     $placeOfService: [String]
//     $extras: [String]
//     $minRate: Int
//     $maxRate: Int
//   ) {
//     usersPermissionsUsers(
//       filters: {
//         and: [
//           { isApprovedByAdmin: { eq: true } },
//           { role: { type: { eq: "service_provider" } } },
//           {
//             or: [
//               { city: { in: $city } }
//             ]
//           },
//           {
//             or: [
//               { name: { containsi: $name } },
//               { lastName: { containsi: $lastName } }
//             ]
//           },
//           {
//             or: [
//               { suburbs: { name: { in: $suburbs } } }
//             ]
//           },
//           {
//             or: [
//               { extras: { item: { in: $extras } } }
//             ]
//           },
//           {
//             or: [
//               { gender: { in: $gender } }
//             ]
//           },
//           {
//             or: [
//               { hairColor: { in: $hairColor } }
//             ]
//           },
//           {
//             or: [
//               { age: { in: $age } }
//             ]
//           },
//           {
//             or: [
//               { eyeColor: { in: $eyeColor } }
//             ]
//           },
//           {
//             or: [
//               { bodyType: { in: $bodyType } }
//             ]
//           },
//           {
//             or: [
//               { bust: { in: $bust } }
//             ]
//           },
//           {
//             or: [
//               { placeOfService: { in: $placeOfService } }
//             ]
//           },
//           {
//             or: [
//               { services: { general: { item: { in: $services } } } },
//               { services: { GFE: { item: { in: $services } } } },
//               { services: { PSE: { item: { in: $services } } } }
//             ]
//           },
//           {
//             or: [
//               { incall: { general: { duration: { eq: "1 hour" }, price: { gte: $minRate, lte: $maxRate } } } },
//               { incall: { GFE: { duration: { eq: "1 hour" }, price: { gte: $minRate, lte: $maxRate } } } },
//               { incall: { PSE: { duration: { eq: "1 hour" }, price: { gte: $minRate, lte: $maxRate } } } },
//               { outcall: { general: { duration: { eq: "1 hour" }, price: { gte: $minRate, lte: $maxRate } } } },
//               { outcall: { GFE: { duration: { eq: "1 hour" }, price: { gte: $minRate, lte: $maxRate } } } },
//               { outcall: { PSE: { duration: { eq: "1 hour" }, price: { gte: $minRate, lte: $maxRate } } } }
//             ]
//           }
//         ]
//       }
//       pagination: { pageSize: 100 }
//     ) {
//       data {
//         id
//         attributes {
//           username
//           name
//           lastName
//           dressSize
//           isApprovedByAdmin
//           verificationStatus {
//             hasBronzeBadge
//             hasGoldBadge
//             hasSilverBadge
//           }
//           availableNow
//           digitalService
//           suburbs {
//             name
//           }
//           gender
//           services {
//             general {
//               item
//             }
//             GFE {
//               item
//             }
//             PSE {
//               item
//             }
//           }
//           hairColor
//           age
//           eyeColor
//           bodyType
//           bust
//           placeOfService
//           extras {
//             item
//           }
//           isApprovedByAdmin
//           availableNow
//           digitalService
//           verificationStatus {
//             hasBronzeBadge
//             hasSilverBadge
//             hasGoldBadge
//           }
//           role {
//             data {
//               attributes {
//                 type
//               }
//             }
//           }
//           incall {
//             general {
//               id
//               duration
//               price
//               additionalInfo
//             }
//             GFE {
//               id
//               duration
//               price
//               additionalInfo
//             }
//             PSE {
//               id
//               duration
//               price
//               additionalInfo
//             }
//           }
//           outcall {
//             general {
//               id
//               duration
//               price
//               additionalInfo
//             }
//             GFE {
//               id
//               duration
//               price
//               additionalInfo
//             }
//             PSE {
//               id
//               duration
//               price
//               additionalInfo
//             }
//           }
//           profilePicture {
//             data {
//               attributes {
//                 name
//                 alternativeText
//                 width
//                 height
//                 url
//               }
//             }
//           }
//         }
//       }
//     }
//   }
// `;

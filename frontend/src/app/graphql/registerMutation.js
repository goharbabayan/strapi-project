import { gql } from '@apollo/client';

const USER_REGISTER_MUTATION = gql`
  mutation register($input: UsersPermissionsRegisterInput!) {
    register(input: $input) {
      jwt
      user {
        id
        username
        email
        role {
          id
          name
        }
      }
    }
  }
`;

export { USER_REGISTER_MUTATION };

// const CREATE_USER_MUTATION = gql`
//   mutation ($data: UsersPermissionsUserInput!) {
//     createUsersPermissionsUser(data: $data) {
//       data {
//         id
//         attributes {
//           username
//           email
//         }
//       }
//     }
//   }
// `;

// export { CREATE_USER_MUTATION };

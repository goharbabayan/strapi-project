import { gql } from '@apollo/client';

const USER_ROLE_MUTATION = gql`
  mutation updateRole($id: ID!, $data: UsersPermissionsUserInput!) {
    updateUsersPermissionsUser(data: $data, id: $id) {
      data {
        attributes {
          username
          email
          role {
            data {
              attributes {
                name
                description
              }
            }
          }
        }
      }
    }
  }
`;

export { USER_ROLE_MUTATION };

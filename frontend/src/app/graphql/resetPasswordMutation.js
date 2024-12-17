import { gql } from '@apollo/client';

const RESET_PASSWORD_MUTATION = gql`
  mutation ResetPassword($code: String!, $password: String!, $passwordConfirmation: String!) {
    resetPassword(code: $code, password: $password, passwordConfirmation: $passwordConfirmation) {
    jwt
      user {
        id
        email
        username
        confirmed
        role {
          name
          description
          type
        }
      }
    }
  }
`

export { RESET_PASSWORD_MUTATION };

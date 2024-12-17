import { gql } from '@apollo/client';

const FORGOT_PASSWORD_MUTATION = gql`
  mutation forgotPassword($email: String!) {
    forgotPassword(email: $email) {
      ok
    }
  }
`

export { FORGOT_PASSWORD_MUTATION };

import { gql } from '@apollo/client';

const EMAIL_CONFIRMATION_MUTATION = gql`
  mutation emailConfirmation($confirmation: String!) {
    emailConfirmation(confirmation: $confirmation) {
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

export { EMAIL_CONFIRMATION_MUTATION };

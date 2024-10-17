import { gql } from '@apollo/client';

const IMAGE_UPLOAD= gql`
  mutation uploadFile($file: Upload!) {
  upload(file: $file) {
    data {
      attributes {
        url
      }
    }
  }
}
`;

export { IMAGE_UPLOAD };

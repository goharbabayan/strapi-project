import { ApolloClient, InMemoryCache } from '@apollo/client'

 const Client = new ApolloClient({
  uri: `${process.env.NEXT_PUBLIC_STRAPI_URL}/graphql`,
  cache: new InMemoryCache()
});

export default Client;

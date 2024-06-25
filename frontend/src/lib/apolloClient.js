import { ApolloClient, InMemoryCache } from '@apollo/client'

 const Client = new ApolloClient({
  uri: process.env.STRAPI_GRAPHQL_API || 'http://localhost:1337/graphql',
  cache: new InMemoryCache()
});

export default Client;

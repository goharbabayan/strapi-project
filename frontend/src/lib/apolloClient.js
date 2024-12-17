import { ApolloClient, InMemoryCache } from '@apollo/client'

 const Client = new ApolloClient({
  uri: 'https://dashboard.sneakylinx.com.au/graphql',
  cache: new InMemoryCache()
});

export default Client;

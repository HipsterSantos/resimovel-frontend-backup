// client.mjs
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:8989/graphql', // Correct property and port
  cache: new InMemoryCache(),
});

// Test query (assuming a simple 'testMail' mutation exists in your schema)
client
  .query({
    query: gql`
      query {
        testMail # Replace with an actual field from your schema
      }
    `,
  })
  .then((result) => console.log('Testing connection from backend:', result))
  .catch((error) => console.error('Test query error:', error));

export default client;
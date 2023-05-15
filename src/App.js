import './App.css';
import { ApolloProvider } from 'react-apollo'
import { Query } from 'react-apollo'
import client from './client'
import { ME } from './graphql'

function App() {
  return (
    <ApolloProvider client={client}>
      <Query query={ME}>
        {
          ({ loading, error, data }) => {
            if (loading) return 'Loading...'
            if (error) return `Error! ${error.message}`
            return <div>{data.user.name}</div>
          }
        }
      </Query>
      <h1>Graphql</h1>
    </ApolloProvider>
  );
}

export default App;

import './App.css';
import { ApolloProvider } from 'react-apollo'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
import client from './client'

const ME = gql`
  query me {
    user(login: "KazukiTakeuchi") {
      name
      avatarUrl
    }
  }
`

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

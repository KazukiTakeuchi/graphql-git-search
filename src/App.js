import './App.css';
import { ApolloProvider } from 'react-apollo'
import { Query } from 'react-apollo'
import client from './client'
import { SEARCH_REPOSITORIES } from './graphql'

const VARIABLES = {
  after: null,
  before: null,
  first: 5,
  last: null,
  query: "フロントエンドエンジニア"
}

const { query, first, last, before, after } = VARIABLES

function App() {
  return (
    <ApolloProvider client={client}>
      <Query
        query={SEARCH_REPOSITORIES}
        variables={{ query, first, last, before, after }}
      >
        {
          ({ loading, error, data }) => {
            if (loading) return 'Loading...'
            if (error) return `Error! ${error.message}`

            console.log({ data })
            return <div></div>
          }
        }
      </Query>
    </ApolloProvider>
  );
}

export default App;

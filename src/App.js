import './App.css';
import { ApolloProvider } from 'react-apollo'
import { Query } from 'react-apollo'
import client from './client'
import { SEARCH_REPOSITORIES } from './graphql'
import { useState } from 'react';

const VARIABLES = {
  after: null,
  before: null,
  first: 5,
  last: null,
  query: "フロントエンドエンジニア"
}

function App() {
  const [variables, setVariables] = useState(VARIABLES)

  const handleChange = event => {
    setVariables({
      ...variables,
      query: event.target.value
    })
  }

  return (
    <ApolloProvider client={client}>
      <from>
        <input value={variables.query} onChange={handleChange} />
      </from>
      <Query
        query={SEARCH_REPOSITORIES}
        variables={variables}
      >
        {
          ({ loading, error, data }) => {
            if (loading) return 'Loading...'
            if (error) return `Error! ${error.message}`

            console.log({ data })
            const search = data.search
            const repositoryCount = search.repositoryCount
            const repositoryUnit = repositoryCount === 1 ? 'Repository' : 'Repositories'
            return <h2>GitHub {repositoryUnit} Search Results - {data.search.repositoryCount}</h2>
          }
        }
      </Query>
    </ApolloProvider>
  );
}

export default App;

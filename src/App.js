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

  const goNext = search => () => {
    setVariables({
      ...variables,
      after: search.pageInfo.endCursor,
      before: null,
      first: 5,
      last: null
    });
  }

  const goPrevious = search => () => {
    setVariables({
      ...variables,
      before: search.pageInfo.startCursor,
      after: null,
      first: null,
      last: 5
    });
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
            const title = `GitHub Repositories Search Results - ${repositoryCount} ${repositoryUnit}`
            return (
              <>
                <h2>{title}</h2>
                <ul>
                  {
                    search.edges.map(edge => {
                      const node = edge.node
                      return (
                        <li key={node.id}>
                          <a href={node.url} target="_blank" rel="noopener noreferrer">{node.name}</a>
                        </li>
                      )
                    })
                  }
                </ul>
                {
                  search.pageInfo.hasNextPage === true ?
                    <button onClick={goNext(search)}>
                      Next
                    </button>
                    :
                    null
                }
                {
                  search.pageInfo.hasPreviousPage === true ?
                    <button onClick={goPrevious(search)}>
                      Previous
                    </button>
                    :
                    null
                }
              </>
            );
          }
        }
      </Query>
    </ApolloProvider>
  );
}

export default App;

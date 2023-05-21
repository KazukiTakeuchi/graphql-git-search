import './App.css';
import { ApolloProvider, Query, Mutation } from 'react-apollo'
import client from './client'
import { SEARCH_REPOSITORIES, ADD_STAR, REMOVE_STAR } from './graphql'
import { useState } from 'react';

const StarButton = ({ node, variables }) => {
  const totalCount = node.stargazers.totalCount
  const viewerHasStarred = node.viewerHasStarred
  const starCount = totalCount === 1 ? "1 star" : `${totalCount} stars`
  const StarStatus = ({ addOrRemoveStar }) => {
    return (
      <button
        onClick={
          () => addOrRemoveStar({
            variables: { input: { starrableId: node.id } },
            update: store => {
              const data = store.readQuery({
                query: SEARCH_REPOSITORIES,
                variables: variables
              })
              const edges = data.search.edges
              edges.map(edge => {
                if (edge.node.id === node.id) {
                  const totalCount = edge.node.stargazers.totalCount
                  const diff = viewerHasStarred ? -1 : 1
                  edge.node.stargazers.totalCount = totalCount + diff
                }
              })
            }
          })
        }
      >
        {starCount} | {viewerHasStarred ? "starred" : "⭐️"}
      </button>
    )
  }

  return (
    <Mutation mutation={viewerHasStarred ? REMOVE_STAR : ADD_STAR}>
      {
        addOrRemoveStar => <StarStatus addOrRemoveStar={addOrRemoveStar} />
      }
    </Mutation>
  )
}

const VARIABLES = {
  after: null,
  before: null,
  first: 5,
  last: null,
  query: "フロントエンドエンジニア"
}

const App = () => {
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
      <form>
        <input value={variables.query} onChange={handleChange} />
      </form>
      <Query
        query={SEARCH_REPOSITORIES}
        variables={variables}
        >
        {
          ({ loading, error, data }) => {
            if (loading) return 'Loading...'
            if (error) return `Error! ${error.message}`

            console.log(data);
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
                          &nbsp;
                          <StarButton node={node} variables={variables} />
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

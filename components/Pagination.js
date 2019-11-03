import React from 'react'
import propTypes from 'prop-types'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
import Head from 'next/head'
import Link from 'next/link'
import PaginationStyles from './styles/PaginationStyles'
import { perPage } from '../config'

const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY {
    itemsConnection {
      aggregate {
        count
      }
    }
  }
`
const Pagination = props => (
  <Query query={PAGINATION_QUERY}>
    {({ error, data, loading }) => {
      const { itemsConnection } = data
      const { count } = itemsConnection.aggregate
      const pages = Math.ceil(count / perPage)

      if (loading) return <p>Loading.....</p>

      return (
        <PaginationStyles>
          <Head>
            <title>
              Sick Fits! Page {props.page} of {pages}
            </title>
          </Head>
          <Link
            prefetch
            href={{ pathname: 'items', query: { page: props.page - 1 } }}
          >
            <a className="prev" aria-disabled={props.page <= 1}>
              Prev
            </a>
          </Link>
          <p>
            Page {props.page} of {pages}
          </p>
          <p>{count} Items Total</p>
          <Link
            prefetch
            href={{ pathname: 'items', query: { page: props.page + 1 } }}
          >
            <a className="next" aria-disabled={props.page >= pages}>
              Next
            </a>
          </Link>
        </PaginationStyles>
      )
    }}
  </Query>
)

Pagination.propTypes = {
  page: propTypes.number,
}

export default Pagination

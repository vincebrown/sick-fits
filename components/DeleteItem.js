import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

// eslint-disable-next-line import/no-cycle
import { ALL_ITEMS_QUERY } from './Items'

const DELETE_ITEM_MUTATION = gql`
  mutation DELETE_ITEM_MUTATION($id: ID!) {
    deleteItem(id: $id) {
      id
    }
  }
`

class DeleteItem extends Component {
  static propTypes = {
    children: PropTypes.node,
    id: PropTypes.string.isRequired,
  }

  _update = (cache, payload) => {
    // manually update cache on client
    const data = cache.readQuery({ query: ALL_ITEMS_QUERY })
    data.items = data.items.filter(
      item => item.id !== payload.data.deleteItem.id
    )
    cache.writeQuery({ query: ALL_ITEMS_QUERY, data })
  }

  render() {
    const { children, id } = this.props

    return (
      <Mutation
        mutation={DELETE_ITEM_MUTATION}
        variables={{ id }}
        update={this._update}
      >
        {(deleteItem, { error }) => (
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to delete?')) {
                deleteItem().catch(err => {
                  alert(err.message)
                })
              }
            }}
            type="button"
          >
            {children}
          </button>
        )}
      </Mutation>
    )
  }
}

export default DeleteItem

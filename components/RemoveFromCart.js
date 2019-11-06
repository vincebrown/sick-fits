import React from 'react'
import PropTypes from 'prop-types'
import { Mutation } from 'react-apollo'
import styled from 'styled-components'
import gql from 'graphql-tag'

import { CURRENT_USER_QUERY } from './User'

const REMOVE_FROM_CART_MUTATION = gql`
  mutation removeFromCart($id: ID!) {
    removeFromCart(id: $id) {
      id
    }
  }
`

const BigButton = styled.button`
  font-size: 3rem;
  background: none;
  border: none;
  &:hover {
    color: ${props => props.theme.red};
    cursor: pointer;
  }
`

class RemoveFromCart extends React.Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
  }

  // This gets called as soon as we get a response
  // Back from the server that mutation happened.
  update = (cache, payload) => {
    // read the cache
    const data = cache.readQuery({ query: CURRENT_USER_QUERY })
    const itemId = payload.data.removeFromCart.id
    // remove item from the cart.
    data.me.cart = data.me.cart.filter(item => item.id !== itemId)
    // write it back to cache.
    cache.writeQuery({ query: CURRENT_USER_QUERY, data })
  }

  render() {
    const { id } = this.props
    return (
      <Mutation
        mutation={REMOVE_FROM_CART_MUTATION}
        update={this.update}
        optimisticResponse={{
          __typename: 'Mutation',
          removeFromCart: {
            __typename: 'CartItem',
            id,
          },
        }}
        variables={{
          id,
        }}
      >
        {(removeFromCart, { error, loading }) => (
          <BigButton
            disabled={loading}
            role="button"
            title="Delete Item"
            onClick={() => {
              removeFromCart().catch(err => alert(err.message))
            }}
          >
            &times;
          </BigButton>
        )}
      </Mutation>
    )
  }
}

export default RemoveFromCart
export { REMOVE_FROM_CART_MUTATION }

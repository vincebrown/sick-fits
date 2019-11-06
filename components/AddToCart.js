import React from 'react'
import PropTypes from 'prop-types'

import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

import { CURRENT_USER_QUERY } from './User'

const ADD_TO_CART_MUTATION = gql`
  mutation addToCart($id: ID!) {
    addToCart(id: $id) {
      id
      quantity
    }
  }
`

class AddToCart extends React.Component {
  static propTypes = {
    id: PropTypes.string,
  }

  render() {
    const { id } = this.props
    return (
      <Mutation
        mutation={ADD_TO_CART_MUTATION}
        variables={{
          id,
        }}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
      >
        {(addToCart, { loading }) => (
          <button disabled={loading} type="button" onClick={addToCart}>
            Add{loading && 'ing'} to Cart
          </button>
        )}
      </Mutation>
    )
  }
}

export default AddToCart
export { ADD_TO_CART_MUTATION }

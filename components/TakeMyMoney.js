import React from 'react'
import StripeCheckout from 'react-stripe-checkout'
import { Mutation } from 'react-apollo'
import Router from 'next/router'
import PropTypes from 'prop-types'
import NProgress from 'nprogress'
import gql from 'graphql-tag'

import calcTotalPrice from '../lib/calcTotalPrice'

import Error from './ErrorMessage'
import User, { CURRENT_USER_QUERY } from './User'

const CREATE_ORDER_MUTATION = gql`
  mutation createOrder($token: String!) {
    createOrder(token: $token) {
      id
      charge
      total
      items {
        id
        title
      }
    }
  }
`

class TakeMyMoney extends React.Component {
  static propTypes = {
    children: PropTypes.any,
  }

  onToken = async (res, createOrder) => {
    NProgress.start()

    const order = await createOrder({
      variables: {
        token: res.id,
      },
    }).catch(err => alert(err.message))

    Router.push({
      pathname: '/order',
      query: {
        id: order.data.createOrder.id,
      },
    })
  }

  render() {
    const { children } = this.props
    return (
      <User>
        {({ data: { me } }) => (
          <Mutation
            mutation={CREATE_ORDER_MUTATION}
            refetchQueries={[{ query: CURRENT_USER_QUERY }]}
          >
            {createOrder => (
              <StripeCheckout
                name="Sick Fits"
                description="Sick Ass Fits"
                amount={calcTotalPrice(me.cart)}
                image={
                  me.cart.length && me.cart[0].item && me.cart[0].item.image
                }
                stripeKey="pk_test_9N8xDxilNDSRYW9lymzjTDEq00XV9jIykQ"
                currency="USD"
                email={me.email}
                token={res => this.onToken(res, createOrder)}
              >
                {children}
              </StripeCheckout>
            )}
          </Mutation>
        )}
      </User>
    )
  }
}

export default TakeMyMoney

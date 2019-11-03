import React from 'react'

import PleaseSignIn from '../components/PleaseSignIn'
import OrdersList from '../components/OrdersList'

const OrdersPage = () => (
  <PleaseSignIn>
    <OrdersList />
  </PleaseSignIn>
)

export default OrdersPage

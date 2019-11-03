import PropTypes from 'prop-types'

// Components
import Order from '../components/Order'
import PleaseSignIn from '../components/PleaseSignIn'

const OrderPage = ({ query }) => (
  <PleaseSignIn>
    <Order id={query.id} />
  </PleaseSignIn>
)

OrderPage.propTypes = {
  query: PropTypes.object,
}

export default OrderPage

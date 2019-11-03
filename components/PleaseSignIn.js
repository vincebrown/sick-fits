import { Query } from 'react-apollo'
import PropTypes from 'prop-types'

import { CURRENT_USER_QUERY } from './User'
import Signin from './Signin'

const PleaseSignIn = props => (
  <Query query={CURRENT_USER_QUERY}>
    {({ data, loading }) => {
      if (loading) return <p>Loading..</p>

      if (!data.me) {
        return (
          <div>
            <h1>Please Sign in before continuing</h1>
            <Signin />
          </div>
        )
      }

      return props.children
    }}
  </Query>
)

PleaseSignIn.propTypes = {
  children: PropTypes.node.isRequired,
}
export default PleaseSignIn

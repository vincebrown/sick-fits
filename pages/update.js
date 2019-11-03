// Packages
import PropTypes from 'prop-types'

// Components
import UpdateItem from '../components/UpdateItem'

const Update = ({ query }) => (
  <div>
    <UpdateItem id={query.id} />
  </div>
)

Update.propTypes = {
  query: PropTypes.object.isRequired,
}

export default Update

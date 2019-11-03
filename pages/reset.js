import PropTypes from 'prop-types'

import Reset from '../components/Reset'

const ResetPage = props => {
  const {
    query: { resetToken },
  } = props
  return (
    <div>
      <Reset resetToken={resetToken} />
    </div>
  )
}

ResetPage.propTypes = {
  query: PropTypes.object,
}

export default ResetPage

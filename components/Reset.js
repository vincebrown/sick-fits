import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

import Form from './styles/Form'
import Error from './ErrorMessage'

import { CURRENT_USER_QUERY } from './User'

const RESET_MUTATION = gql`
  mutation RESET_MUTATION(
    $resetToken: String!
    $newPassword: String!
    $confirmPassword: String!
  ) {
    resetPassword(
      resetToken: $resetToken
      newPassword: $newPassword
      confirmPassword: $confirmPassword
    ) {
      id
      name
      email
    }
  }
`

export default class Reset extends Component {
  static propTypes = {
    resetToken: PropTypes.string.isRequired,
  }

  state = {
    newPassword: '',
    confirmPassword: '',
  }

  saveToState = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  render() {
    const { newPassword, confirmPassword } = this.state
    const { resetToken } = this.props
    return (
      <Mutation
        mutation={RESET_MUTATION}
        variables={{
          resetToken,
          newPassword,
          confirmPassword,
        }}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
      >
        {(resetPassword, { error, loading, called }) => (
          <Form
            method="post"
            onSubmit={async e => {
              e.preventDefault()
              await resetPassword(newPassword, confirmPassword)
              this.setState({ newPassword: '', confirmPassword: '' })
            }}
          >
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Reset Password</h2>
              <Error error={error} />
              {!error && !loading && called && (
                <p>Success! Your Password has been reset</p>
              )}
              <label htmlFor="newPassword">
                New Password
                <input
                  type="password"
                  name="newPassword"
                  placeholder="Enter a new Password"
                  value={newPassword}
                  onChange={this.saveToState}
                />
              </label>
              <label htmlFor="confirmPassword">
                Confirm Password
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm your new password"
                  value={confirmPassword}
                  onChange={this.saveToState}
                />
              </label>

              <button type="submit">Reset Password</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    )
  }
}

import React, { Component } from 'react'
import { Query, Mutation } from 'react-apollo'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import Error from './ErrorMessage'
import Table from './styles/Table'
import SickButton from './styles/SickButton'

const possiblePermissions = [
  'ADMIN',
  'USER',
  'ITEMCREATE',
  'ITEMDELETE',
  'PERMISSIONUPDATE',
]

const ALL_USERS_QUERY = gql`
  query ALL_USERS_QUERY {
    users {
      id
      name
      email
      permissions
    }
  }
`

const UPDATE_PERMISSIONS_MUTATION = gql`
  mutation UPDATE_PERMISSIONS_MUTATION(
    $permissions: [Permission]
    $userId: ID!
  ) {
    updatePermissions(permissions: $permissions, userId: $userId) {
      id
      name
      email
      permissions
    }
  }
`

const Permissions = () => (
  <Query query={ALL_USERS_QUERY}>
    {({ data, loading, error }) => {
      if (error) return <Error error={error} />
      if (loading) return <p>Loading...</p>

      return (
        <div>
          <h2>Manage Permissions</h2>
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                {possiblePermissions.map(permission => (
                  <th key={`${permission}-head`}>{permission}</th>
                ))}
                <th>👇</th>
              </tr>
            </thead>
            <tbody>
              {data.users.map(user => (
                <UserPermissions key={`${user.id}-permission`} user={user} />
              ))}
            </tbody>
          </Table>
        </div>
      )
    }}
  </Query>
)

class UserPermissions extends Component {
  static propTypes = {
    user: PropTypes.shape({
      name: PropTypes.string,
      email: PropTypes.string,
      permissions: PropTypes.array,
    }).isRequired,
  }

  constructor(props) {
    super(props)

    const { user } = props

    this.state = {
      permissions: user.permissions,
    }
  }

  handlePermissionChange = e => {
    const { permissions } = this.state
    const checkbox = e.target
    let updatedPermissions = [...permissions]
    if (checkbox.checked) {
      updatedPermissions.push(checkbox.value)
    } else {
      updatedPermissions = updatedPermissions.filter(
        permission => permission !== checkbox.value
      )
    }
    this.setState({ permissions: updatedPermissions })
  }

  render() {
    const { user } = this.props
    const { permissions } = this.state
    return (
      <Mutation
        mutation={UPDATE_PERMISSIONS_MUTATION}
        variables={{
          permissions,
          userId: user.id,
        }}
      >
        {(updatePermissions, { loading, error }) => (
          <>
            {error && <Error error={error} />}
            <tr>
              <td>{user.name}</td>
              <td>{user.email}</td>
              {possiblePermissions.map(permission => (
                <td key={`${permission}-key`}>
                  <label htmlFor={`${user.id}-permission${permission}`}>
                    <input
                      type="checkbox"
                      id={`${user.id}-permission${permission}`}
                      checked={permissions.includes(permission)}
                      value={permission}
                      onChange={this.handlePermissionChange}
                    />
                  </label>
                </td>
              ))}
              <td>
                <SickButton
                  type="button"
                  disabled={loading}
                  onClick={updatePermissions}
                >
                  Updat{loading ? 'ing' : 'e'}
                </SickButton>
              </td>
            </tr>
          </>
        )}
      </Mutation>
    )
  }
}

export default Permissions

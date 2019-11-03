// Packages
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Mutation, Query } from 'react-apollo'
import gql from 'graphql-tag'
import Router from 'next/router'

// Components
import ErrorMessage from './ErrorMessage'

// Styled Components
import Form from './styles/Form'

// Query
const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      description
      price
    }
  }
`

const UPDATE_ITEM_MUTATION = gql`
  mutation UPDATE_ITEM_MUTATION(
    $id: ID!
    $title: String
    $description: String
    $price: Int
  ) {
    updateItem(
      id: $id
      title: $title
      description: $description
      price: $price
    ) {
      id
      title
      description
      price
    }
  }
`

class UpdateItem extends Component {
  static propTypes = {
    id: PropTypes.string,
  }

  state = {}

  _handleChange = e => {
    const { name, type, value } = e.target
    const val = type === 'number' ? parseFloat(value) : value
    this.setState({ [name]: val })
  }

  _updateItem = async (e, updateItemMutation) => {
    e.preventDefault()
    const { id } = this.props
    const resp = await updateItemMutation({
      variables: {
        id,
        ...this.state,
      },
    })
  }

  render() {
    const { id } = this.props
    return (
      <Query query={SINGLE_ITEM_QUERY} variables={{ id }}>
        {({ data, loading }) => {
          if (loading) return <p>Loading...</p>

          if (!data.item) return <p>No Item Found...</p>

          return (
            <Mutation mutation={UPDATE_ITEM_MUTATION} variables={this.state}>
              {// eslint-disable-next-line no-shadow
              (updateItem, { loading, error }) => (
                <Form onSubmit={e => this._updateItem(e, updateItem)}>
                  <ErrorMessage error={error} />

                  <fieldset disabled={loading} aria-busy={loading}>
                    <label htmlFor="title">
                      Title
                      <input
                        type="text"
                        id="title"
                        name="title"
                        placeholder="Title"
                        required
                        defaultValue={data.item.title}
                        onChange={this._handleChange}
                      />
                    </label>

                    <label htmlFor="title">
                      Price
                      <input
                        type="number"
                        id="price"
                        name="price"
                        placeholder="Price"
                        required
                        defaultValue={data.item.price}
                        onChange={this._handleChange}
                      />
                    </label>

                    <label htmlFor="title">
                      Description
                      <textarea
                        type="text"
                        id="description"
                        name="description"
                        placeholder="Description"
                        required
                        defaultValue={data.item.description}
                        onChange={this._handleChange}
                      />
                    </label>
                    <button type="submit">Save Item</button>
                  </fieldset>
                </Form>
              )}
            </Mutation>
          )
        }}
      </Query>
    )
  }
}

export default UpdateItem
export { UPDATE_ITEM_MUTATION }

// Packages
import { mount } from 'enzyme'
import wait from 'waait'
import toJSON from 'enzyme-to-json'
import Router from 'next/router'
import { MockedProvider } from 'react-apollo/test-utils'
import { ApolloConusumer, ApolloConsumer } from 'react-apollo'
import NProgress from 'nprogress'

// Libs
import { fakeCartItem, fakeUser } from '../lib/testUtils'

// Components
import TakeMyMoney, { CREATE_ORDER_MUTATION } from '../components/TakeMyMoney'
import { CURRENT_USER_QUERY } from '../components/User'

Router.router = { push() {} }
const mocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: {
      data: {
        me: {
          ...fakeUser(),
          cart: [fakeCartItem()],
        },
      },
    },
  },
]

describe('<TakeMyMoney />', () => {
  it('renders and matches snapshot', async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <TakeMyMoney />
      </MockedProvider>
    )
    await wait()
    wrapper.update()
    const checkoutButton = wrapper.find('ReactStripeCheckout')
    expect(toJSON(checkoutButton)).toMatchSnapshot()
  })

  it('creates an order token ', async () => {
    const createOrderMock = jest.fn().mockResolvedValue({
      data: { createOrder: { id: 'xyz789' } },
    })

    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <TakeMyMoney />
      </MockedProvider>
    )

    const component = wrapper.find('TakeMyMoney').instance()
    // Call onToken
    component.onToken({ id: 'abc123' }, createOrderMock)
    expect(createOrderMock).toHaveBeenCalled()
    expect(createOrderMock).toHaveBeenCalledWith({
      variables: { token: 'abc123' },
    })
  })

  it('turns the progress bar on', async () => {
    NProgress.start = jest.fn()
    const createOrderMock = jest.fn().mockResolvedValue({
      data: { createOrder: { id: 'xyz789' } },
    })

    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <TakeMyMoney />
      </MockedProvider>
    )
    const component = wrapper.find('TakeMyMoney').instance()
    // Call onToken
    component.onToken({ id: 'abc123' }, createOrderMock)
    expect(NProgress.start).toHaveBeenCalled()
  })

  it('routes to the order page when completed', async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <TakeMyMoney />
      </MockedProvider>
    )
    await wait()
    wrapper.update()
    const createOrderMock = jest.fn().mockResolvedValue({
      data: { createOrder: { id: 'xyz789' } },
    })
    const component = wrapper.find('TakeMyMoney').instance()
    Router.router.push = jest.fn()
    // manually call that onToken method
    component.onToken({ id: 'abc123' }, createOrderMock)
    await wait()
    expect(Router.router.push).toHaveBeenCalled()
  })
})

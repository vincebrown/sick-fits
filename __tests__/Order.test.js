import { mount } from 'enzyme'
import toJSON from 'enzyme-to-json'
import wait from 'waait'
import { MockedProvider } from 'react-apollo/test-utils'
import Order, { SINGLE_ORDER_QUERY } from '../components/Order'
import { fakeOrder } from '../lib/testUtils'

const mocks = [
  {
    request: { query: SINGLE_ORDER_QUERY, variables: { id: 'abc123' } },
    result: { data: { order: fakeOrder() } },
  },
]

describe('<Order />', () => {
  it('renders and shows loading state', async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <Order id="abc123" />
      </MockedProvider>
    )
    const loading = wrapper.find('p')
    expect(toJSON(loading)).toMatchSnapshot()
  })

  it('renders and matches snapshot', async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <Order id="abc123" />
      </MockedProvider>
    )
    await wait()
    wrapper.update()
    const order = wrapper.find('div[data-test="order"]')
    expect(toJSON(order)).toMatchSnapshot()
  })
})

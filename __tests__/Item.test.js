import { shallow } from 'enzyme'
import Item from '../components/Item'

const fakeItem = {
  id: 'abcd123',
  title: 'A Cool Item',
  description: 'This item is really cool.',
  image: 'item.jpg',
  largeImage: 'itemLarge.jpg',
  price: 5000,
}

// Very brittle if we change layout of component tests will break, will want to use snapshots.
describe('<Item/>', () => {
  const wrapper = shallow(<Item item={fakeItem} />)
  it('renders the title', () => {
    const title = wrapper.find('Title a').text()
    expect(title).toBe(fakeItem.title)
  })

  it('renders the description', () => {
    const description = wrapper.find('p').text()
    expect(description).toBe(fakeItem.description)
  })

  it('renders the image', () => {
    const img = wrapper.find('img')
    expect(img.props().src).toBe(fakeItem.image)
    expect(img.props().alt).toBe(fakeItem.title)
  })

  it('renders the price', () => {
    const PriceTag = wrapper.find('PriceTag')
    expect(PriceTag.children().text()).toBe('$50')
  })

  it('renders the buttons', () => {
    const buttonList = wrapper.find('.buttonList')
    expect(buttonList.children()).toHaveLength(3)
    expect(buttonList.find('Link').exists()).toBe(true)
    expect(buttonList.find('AddToCart').exists()).toBe(true)
    expect(buttonList.find('DeleteItem').exists()).toBe(true)
  })
})

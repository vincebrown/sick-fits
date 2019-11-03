function Person(name, foods) {
  this.name = name
  this.foods = foods
}

Person.prototype.fetchFavFoods = function() {
  return new Promise((resolve, reject) => {
    // Simulating an API
    setTimeout(() => resolve(this.foods), 2000)
  })
}

describe('mocking learning', () => {
  it('mocks a reg function', () => {
    const fetchDogs = jest.fn()
    fetchDogs('snickers')
    expect(fetchDogs).toHaveBeenCalled()
    expect(fetchDogs).toHaveBeenCalledWith('snickers')
    fetchDogs('hugo')
    expect(fetchDogs).toHaveBeenCalledTimes(2)
  })

  it('can create a person', () => {
    const me = new Person('Vince', ['tacos', 'cheesecake'])
    expect(me.name).toBe('Vince')
  })

  it('can fetch foods', async () => {
    const me = new Person('Vince', ['tacos', 'cheesecake'])
    // mock the favFoods function
    me.fetchFavFoods = jest.fn().mockResolvedValue(['tacos', 'ramen'])
    const favFoods = await me.fetchFavFoods()
    expect(favFoods).toContain('tacos')
  })
})

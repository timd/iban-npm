import {sum} from '../index'
describe('testing a function', () => {

  it('should return 3 when passed 1 & 2', () => {
    const result = sum(1,2)
    expect(result).toEqual(3) 
  })


})
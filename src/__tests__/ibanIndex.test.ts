import * as index from '../index'; 

describe('Index exports', () => {
  test('all exports are defined', () => {
    expect(index).toBeDefined();
    expect(typeof index.isValid).toBe('function');
    expect(typeof index.isValidWithResult).toBe('function');
  });
});
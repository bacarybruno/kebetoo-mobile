import * as strings from '../strings'

it('capitalizes string', () => {
  const testCases = [{
    actual: 'Hello World',
    expected: 'Hello world',
  }, {
    actual: '',
    expected: '',
  }, {
    actual: {},
    expected: '',
  }, {
    actual: 'hello world',
    expected: 'Hello world',
  }, {
    actual: 'hello world. im kebetoo',
    expected: 'Hello world. Im kebetoo',
  }]
  testCases.forEach((testCase) => {
    expect(strings.capitalize(testCase.actual)).toBe(testCase.expected)
  })
})

it('abbreviates number', () => {
  const testCases = [{
    actual: 0,
    expected: 0,
  }, {
    actual: 1,
    expected: 1,
  }, {
    actual: 10,
    expected: 10,
  }, {
    actual: 1000,
    expected: '1K',
  }, {
    actual: 1001,
    expected: '1K',
  }, {
    actual: 1100,
    expected: '1.1K',
  }, {
    actual: 1000000,
    expected: '1M',
  }]
  testCases.forEach((testCase) => {
    expect(strings.readableNumber(testCase.actual, 1)).toBe(testCase.expected)
  })
})

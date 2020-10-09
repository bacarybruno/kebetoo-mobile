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

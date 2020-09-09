import useDebounce from '../debounce'

it('debounces function', () => {
  const waitTime = 1000
  const func = jest.fn()
  const debouncedFunc = useDebounce(func, 1000)
  debouncedFunc()
  expect(func).toBeCalledTimes(0)
  setTimeout(() => {
    expect(func).toBeCalledTimes(1)
  }, waitTime)
})

import useDebounce from '../debounce'

it('debounces function', async () => {
  jest.useFakeTimers()
  const func = jest.fn()
  const debouncedFunc = useDebounce(func, 10000)
  debouncedFunc()
  debouncedFunc()
  expect(func).toBeCalledTimes(0)
  jest.runAllTimers()
  expect(func).toBeCalledTimes(1)
})

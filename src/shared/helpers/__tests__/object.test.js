import * as object from '../object'

it('merges arrays', () => {
  expect(object.mergeArrays([], [])).toStrictEqual([])
  expect(object.mergeArrays([1, 2], [3, 4])).toStrictEqual([1, 2, 3, 4])
  expect(object.mergeArrays([1, 2], [])).toStrictEqual([1, 2])
  expect(object.mergeArrays([1, 2], true)).toStrictEqual([1, 2, true])
})

it('merges objects', () => {
  expect(object.mergeObjects({}, {})).toStrictEqual({})
  expect(object.mergeObjects({ a: 1 }, { b: 2 })).toStrictEqual({ a: 1, b: 2 })
})

it('deletes property', () => {
  expect(object.deleteProperty({ name: 'hello', value: 'world' }, 'name')).toStrictEqual({ value: 'world' })
  expect(object.deleteProperty({}, 'hello')).toStrictEqual({})
})

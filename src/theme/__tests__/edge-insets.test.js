import {
  all, fromTRBL, only, symmetric, zero,
} from '../edge-insets'

test('fromTRBL', () => {
  expect(fromTRBL(3, 5, 8, 13)).toStrictEqual({
    top: 3,
    right: 5,
    bottom: 8,
    left: 13,
  })
  expect(() => {
    fromTRBL(null, 5, 8, 13)
  }).toThrowError()
})

test('symmetric', () => {
  expect(symmetric({ horizontal: 10, vertical: 100 })).toStrictEqual({
    top: 100,
    right: 10,
    bottom: 100,
    left: 10,
  })
  expect(symmetric({})).toStrictEqual({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  })
})

test('only', () => {
  expect(only({ top: 10 })).toStrictEqual({
    top: 10,
    right: 0,
    bottom: 0,
    left: 0,
  })
  expect(only({ right: 10 })).toStrictEqual({
    top: 0,
    right: 10,
    bottom: 0,
    left: 0,
  })
  expect(only({ bottom: 10 })).toStrictEqual({
    top: 0,
    right: 0,
    bottom: 10,
    left: 0,
  })
  expect(only({ left: 10 })).toStrictEqual({
    top: 0,
    right: 0,
    bottom: 0,
    left: 10,
  })
})

test('all', () => {
  expect(all(10)).toStrictEqual({
    top: 10,
    right: 10,
    bottom: 10,
    left: 10,
  })
})

test('zero', () => {
  expect(zero()).toStrictEqual({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  })
})

import edgeInsets from '../edge-insets';

test('fromTRBL', () => {
  expect(edgeInsets.fromTRBL(3, 5, 8, 13)).toStrictEqual({
    top: 3,
    right: 5,
    bottom: 8,
    left: 13,
  });
  expect(() => edgeInsets.fromTRBL(null, 5, 8, 13)).toThrowError();
});

test('symmetric', () => {
  expect(edgeInsets.symmetric({ horizontal: 10, vertical: 100 })).toStrictEqual({
    top: 100,
    right: 10,
    bottom: 100,
    left: 10,
  });
  expect(edgeInsets.symmetric({})).toStrictEqual({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  });
});

test('only', () => {
  expect(edgeInsets.only({ top: 10 })).toStrictEqual({
    top: 10,
    right: 0,
    bottom: 0,
    left: 0,
  });
  expect(edgeInsets.only({ right: 10 })).toStrictEqual({
    top: 0,
    right: 10,
    bottom: 0,
    left: 0,
  });
  expect(edgeInsets.only({ bottom: 10 })).toStrictEqual({
    top: 0,
    right: 0,
    bottom: 10,
    left: 0,
  });
  expect(edgeInsets.only({ left: 10 })).toStrictEqual({
    top: 0,
    right: 0,
    bottom: 0,
    left: 10,
  });
});

test('all', () => {
  expect(edgeInsets.all(10)).toStrictEqual({
    top: 10,
    right: 10,
    bottom: 10,
    left: 10,
  });
});

test('zero', () => {
  expect(edgeInsets.zero()).toStrictEqual({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  });
});

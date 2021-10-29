import metrics, { getDefaultHeaderHeight } from '../metrics';

it('is defined', () => {
  expect(metrics.screenWidth).toBeDefined();
  expect(metrics.screenHeight).toBeDefined();
  expect(metrics.aspectRatio).toBeDefined();
  expect(metrics.headerHeight).toBeDefined();
  expect(metrics.marginHorizontal).toBeDefined();
  expect(metrics.marginVertical).toBeDefined();
  expect(metrics.tabBarFullHeight).toBeDefined();
  expect(metrics.tabBarHeight).toBeDefined();
});

describe('header height', () => {
  test('android value', () => {
    const headerHeight = getDefaultHeaderHeight(0, {
      OS: 'android',
    });
    expect(headerHeight).toBe(56);
  });
  test('ios value', () => {
    const headerHeight = getDefaultHeaderHeight(0, {
      OS: 'ios',
    });
    expect(headerHeight).toBe(44);
  });
  test('landscape', () => {
    const headerHeight = getDefaultHeaderHeight(0, {
      OS: 'ios',
      isPad: false,
    }, 100, 50);
    expect(headerHeight).toBe(32);
  });
  test('other value', () => {
    const headerHeight = getDefaultHeaderHeight(0, {
      OS: 'windows',
    });
    expect(headerHeight).toBe(64);
  });
});

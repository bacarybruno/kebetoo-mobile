/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-undef */
import React from 'react'
import { render } from 'react-native-testing-library'

// helper to setup unit tests
// eslint-disable-next-line arrow-body-style
export default setupTest = (WrappedComponent, renderFn = render) => {
  return (defaultProps = {}) => (additionalProps = {}) => {
    const propsWithArgs = {
      ...defaultProps,
      ...additionalProps,
    }
    const wrapper = renderFn(<WrappedComponent {...propsWithArgs} />)
    return { wrapper, props: propsWithArgs }
  }
}

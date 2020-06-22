/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-undef */
import React from 'react'
import TestRenderer from 'react-test-renderer'

// helper to setup unit tests
// eslint-disable-next-line arrow-body-style
const setupTest = (WrappedComponent, renderFn = TestRenderer.create) => {
  return (defaultProps = {}) => (additionalProps = {}) => {
    const propsWithArgs = {
      ...defaultProps,
      ...additionalProps,
    }
    const wrapper = renderFn(<WrappedComponent {...propsWithArgs} />)
    return { wrapper, props: propsWithArgs }
  }
}

export default setupTest

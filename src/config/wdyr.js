import React from 'react'

if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line import/no-extraneous-dependencies
  const whyDidYouRender = require('@welldone-software/why-did-you-render')
  const ReactRedux = require('react-redux')
  whyDidYouRender(React, {
    trackAllPureComponents: true,
    trackExtraHooks: [
      [ReactRedux, 'useSelector'],
    ],
  })
}

/* eslint-disable no-undef */

// TODO: use env variables
export default {
  apiBaseUrl: __DEV__ ? 'http://localhost:1337' : 'https://kebetoo.herokuapp.com',
  assetsBaseUrl: __DEV__ ? 'http://localhost:1337' : 'https://kebetoo.s3.eu-west-3.amazonaws.com',
}

import { GoogleSignin } from '@react-native-community/google-signin'

GoogleSignin.configure({
  scopes: ['email', 'profile', 'openid'],
  webClientId: '355888072499-spu5d874qrfb6tfs3pq195cjf6ij56go.apps.googleusercontent.com',
})

// eslint-disable-next-line import/no-unresolved
import { API_BASE_URL, ASSETS_BASE_URL, GOOGLE_SIGNIN_WEB_CLIENT_ID } from '@env';

export default {
  apiBaseUrl: API_BASE_URL,
  assetsBaseUrl: ASSETS_BASE_URL,
  googleSigninWebClientId: GOOGLE_SIGNIN_WEB_CLIENT_ID,
  stories: {
    aspectRatio: {
      width: 540,
      height: 960,
    },
  },
  maxLength: {
    fullname: 60,
    username: 20,
    email: 254,
    password: 128,
    bio: 160,
    post: {
      text: 254,
      audio: 30,
      comments: 1024,
    },
  },
};

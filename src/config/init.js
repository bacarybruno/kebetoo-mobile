import { GoogleSignin } from '@react-native-community/google-signin';
import env from './env';

GoogleSignin.configure({
  scopes: ['email', 'profile', 'openid'],
  webClientId: env.googleSigninWebClientId,
});

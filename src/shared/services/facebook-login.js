import { LoginManager, AccessToken } from 'react-native-fbsdk';
import auth from '@react-native-firebase/auth';

export const getFacebookPicture = (profileId) => `https://graph.facebook.com/${profileId}/picture?type=large`;

const facebookLogin = async () => {
  const result = { error: null, data: null };
  try {
    LoginManager.logOut();
    await LoginManager.logInWithPermissions(['public_profile', 'email']);
    const { accessToken } = await AccessToken.getCurrentAccessToken();
    const facebookCredential = auth.FacebookAuthProvider.credential(accessToken);
    const data = await auth().signInWithCredential(facebookCredential);

    result.data = data;
  } catch (error) {
    result.error = error;
  }
  return Promise.resolve(result);
};

export default facebookLogin;

import { GoogleSignin } from '@react-native-community/google-signin';
import auth from '@react-native-firebase/auth';

const googleLogin = async () => {
  const result = { error: null, data: null };
  try {
    await GoogleSignin.hasPlayServices();
    await GoogleSignin.signOut();
    const { idToken } = await GoogleSignin.signIn();
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    const data = await auth().signInWithCredential(googleCredential);
    result.data = data;
  } catch (error) {
    // if (error.code === statusCodes.SIGN_IN_CANCELLED) {
    //   // user cancelled the login flow
    // } else if (error.code === statusCodes.IN_PROGRESS) {
    //   // operation (e.g. sign in) is in progress already
    // } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
    //   // play services not available or outdated
    // } else {
    //   // some other error happened
    // }
    result.error = error;
  }
  return Promise.resolve(result);
};

export default googleLogin;

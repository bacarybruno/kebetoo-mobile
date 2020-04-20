import { LoginManager, AccessToken } from 'react-native-fbsdk'
import auth from '@react-native-firebase/auth'

// TODO: handle result errors
const facebookLogin = async () => {
  const result = { error: null, data: null }
  try {
    LoginManager.logOut()
    const loginResult = await LoginManager.logInWithPermissions(['public_profile', 'email'])
    const { accessToken } = await AccessToken.getCurrentAccessToken()
    const facebookCredential = auth.FacebookAuthProvider.credential(accessToken)
    result.data = await auth().signInWithCredential(facebookCredential)
  } catch (error) {
    result.error = error
  }
  return Promise.resolve(result)
}

export default facebookLogin

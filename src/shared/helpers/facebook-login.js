import { LoginManager, AccessToken } from 'react-native-fbsdk'
import auth from '@react-native-firebase/auth'

import { createUser } from 'Kebetoo/src/shared/helpers/users'

export const getFacebookPicture = (profileId) => `https://graph.facebook.com/${profileId}/picture?type=large`

// TODO: handle result errors
const facebookLogin = async () => {
  const result = { error: null, data: null }
  try {
    LoginManager.logOut()
    const loginResult = await LoginManager.logInWithPermissions(['public_profile', 'email'])
    const { accessToken } = await AccessToken.getCurrentAccessToken()
    const facebookCredential = auth.FacebookAuthProvider.credential(accessToken)
    const data = await auth().signInWithCredential(facebookCredential)

    const { additionalUserInfo, user } = data
    const { profile } = additionalUserInfo
    const { id: profileId } = profile

    await createUser({
      id: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: getFacebookPicture(profileId),
    })

    user.updateProfile({ photoURL: getFacebookPicture(profileId) })

    result.data = data
  } catch (error) {
    result.error = error
    console.log(error)
  }
  return Promise.resolve(result)
}

export default facebookLogin

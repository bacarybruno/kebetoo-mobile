import messaging from '@react-native-firebase/messaging'

import { api } from '@app/shared/services'

export const getUser = async (uid) => {
  const [author] = await api.authors.getByUid(uid)
  return author
}

export const createOrUpdateUser = async ({ id, displayName, photoURL }) => {
  const existingAuthor = await getUser(id)
  let authorId
  if (existingAuthor) {
    authorId = existingAuthor.id
    await api.authors.update(authorId, { displayName, photoURL })
  } else {
    const createdAuthor = await api.authors.create({ uid: id, displayName, photoURL })
    authorId = createdAuthor.id
  }
  return authorId
}

export const getNotificationToken = async () => {
  if (messaging().isDeviceRegisteredForRemoteMessages) {
    const token = await messaging().getToken()
    return token
  }
  return null
}

export const getUsers = (ids) => api.authors.batchGetById(ids)

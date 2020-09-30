import AsyncStorage from '@react-native-community/async-storage'

import * as api from '@app/shared/services/http'

export const setUserId = async (uid) => AsyncStorage.setItem('uid', uid)

export const getUserId = async () => AsyncStorage.getItem('uid')

export const clearUserAttributes = async () => AsyncStorage.multiRemove(['uid'])

export const getUser = async (uid) => {
  const [author] = await api.getAuthorByUid(uid)
  return author
}

export const createUser = async ({ id, displayName, photoURL }) => {
  const existingAuthor = await getUser(id)
  let authorId
  if (existingAuthor) {
    authorId = existingAuthor.id
  } else {
    const createdAuthor = await api.createAuthor({ id, displayName, photoURL })
    authorId = createdAuthor.id
  }
  await setUserId(authorId)
  return authorId
}

export const getUsers = (ids) => api.getAuthors(ids)

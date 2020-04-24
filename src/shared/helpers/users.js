import firestore from '@react-native-firebase/firestore'

export const usersCollection = firestore().collection('users')

export const createUser = async ({
  id, displayName, email, photoURL,
}) => usersCollection.doc(id).set({
  displayName, email, photoURL,
}, { merge: true })

export const getUsers = async (ids) => usersCollection.where(
  firestore.FieldPath.documentId(),
  'in',
  ids,
).get()

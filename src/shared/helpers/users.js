import firestore from '@react-native-firebase/firestore'

export const usersCollection = firestore().collection('users')

export const chunkArray = (array, size) => {
  const results = []
  while (array.length) {
    results.push(array.splice(0, size))
  }
  return results
}

export const createUser = async ({
  id, displayName, email, photoURL,
}) => usersCollection.doc(id).set({
  displayName, email, photoURL,
}, { merge: true })

export const getUsers = async (ids) => {
  const chunks = chunkArray(ids, 10)
  const promises = await Promise.all((chunks).map((chunk) => usersCollection.where(
    firestore.FieldPath.documentId(),
    'in',
    chunk,
  ).get()))
  return {
    docs: promises.flatMap((promise) => promise.docs),
  }
}

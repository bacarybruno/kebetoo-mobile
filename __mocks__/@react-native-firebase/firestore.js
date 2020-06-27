import authorsFixtures from 'Kebetoo/__fixtures__/authors'

const authors = authorsFixtures.map((author) => ({
  id: author.uid,
  data: jest.fn().mockReturnValue({ ...author, id: author.uid }),
}))

const collection = jest.fn((name) => ({
  doc: jest.fn(() => ({
    collection,
    update: jest.fn().mockResolvedValue(true),
    onSnapshot: jest.fn().mockResolvedValue(true),
    get: jest.fn().mockResolvedValue(true),
    set: jest.fn().mockResolvedValue(true),
  })),
  where: jest.fn(() => ({
    get: jest.fn().mockResolvedValue(name === 'users' ? ({ docs: authors }) : []),
    onSnapshot: jest.fn().mockResolvedValue(true),
  })),
}))

const firestore = () => ({
  collection,
})

firestore.FieldValue = {
  serverTimestamp: jest.fn(),
}

firestore.FieldPath = {
  documentId: jest.fn().mockReturnValue('rnfirebase.firestore.fieldpath.document-id'),
}

export default firestore

const collection = jest.fn(() => ({
  doc: jest.fn(() => ({
    collection,
    update: jest.fn(() => Promise.resolve(true)),
    onSnapshot: jest.fn(() => Promise.resolve(true)),
    get: jest.fn(() => Promise.resolve(true)),
  })),
  where: jest.fn(() => ({
    get: jest.fn(() => Promise.resolve(true)),
    onSnapshot: jest.fn(() => Promise.resolve(true)),
  })),
}))

const firestore = () => ({
  collection,
})

firestore.FieldValue = {
  serverTimestamp: jest.fn(),
}

export default firestore

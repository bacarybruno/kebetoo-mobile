const data = {}

const snapshot = {
  val: () => data,
  exportVal: () => data,
  exists: jest.fn(() => true),
}

const database = jest.fn().mockReturnValue({
  ref: jest.fn().mockReturnThis(),
  on: jest.fn((eventType, callback) => callback(snapshot)),
  off: jest.fn((eventType, callback) => callback(snapshot)),
  update: jest.fn().mockResolvedValue(snapshot),
  remove: jest.fn().mockResolvedValue({}),
  onDisconnect: jest.fn().mockReturnThis(),
  once: jest.fn().mockResolvedValue(snapshot),
  set: jest.fn().mockResolvedValue(snapshot),
  child: jest.fn().mockReturnThis(),
  orderByChild: jest.fn().mockReturnThis(),
  limitToLast: jest.fn().mockReturnThis(),
})

export default database

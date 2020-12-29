module.exports = {
  getInitialShare: jest.fn(),
  addNewShareListener: jest.fn().mockReturnValue({ remove: jest.fn() }),
}

class SoundMock {
  constructor() {
    return this;
  }
}

SoundMock.prototype.setVolume = jest.fn();
SoundMock.prototype.setNumberOfLoops = jest.fn();
SoundMock.prototype.play = jest.fn();
SoundMock.prototype.stop = jest.fn();

SoundMock.setCategory = jest.fn();

module.exports = SoundMock;

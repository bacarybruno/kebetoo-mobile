/* eslint-disable max-classes-per-file */

export { MediaStates } from '@react-native-community/audio-toolkit';

export class Recorder {
  constructor() {
    return this;
  }

  prepare = jest.fn().mockImplementation((cb) => cb())

  record = jest.fn().mockReturnValue(this)

  stop = jest.fn().mockImplementation((cb) => cb())
}

export class Player {
  constructor() {
    return this;
  }
}

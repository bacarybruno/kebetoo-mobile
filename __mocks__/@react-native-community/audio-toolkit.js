/* eslint-disable max-classes-per-file */

export { MediaStates } from '@react-native-community/audio-toolkit'

export class Recorder {
  constructor(name, config) {
    return this
  }

  prepare = jest.fn().mockImplementation((cb) => cb())

  record = jest.fn().mockReturnValue(this)

  stop = jest.fn().mockImplementation((cb) => cb())

  toggleRecord = jest.fn().mockImplementation((cb) => { if (cb) cb() })
}

export class Player {
  constructor() {
    return this
  }
}

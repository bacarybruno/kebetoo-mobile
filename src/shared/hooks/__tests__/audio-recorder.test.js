import React from 'react'
import { render, act } from 'react-native-testing-library'
import RNFetchBlob from 'rn-fetch-blob'

import useAudioRecorder from '../audio-recorder'

/**
 * Audio Recorder hook
 * @param {String} uri a predefined audio uri
 * @param {Number} minDuration the min duration of the recorded audio
 * @param {*} maxDuration the max duration of the recorded audio
 */
const createAudioRecorder = (...props) => {
  const returnVal = {}
  const TestComponent = () => {
    Object.assign(returnVal, useAudioRecorder(...props))
    return null
  }
  render(<TestComponent />)
  return returnVal
}

it('is defined', () => {
  const audioRecorder = createAudioRecorder()
  // props
  expect(audioRecorder.hasRecording).toBeDefined()
  expect(audioRecorder.elapsedTime).toBeDefined()
  expect(audioRecorder.recordUri).toBeDefined()
  expect(audioRecorder.isRecording).toBeDefined()
  // mutators
  expect(audioRecorder.start).toBeDefined()
  expect(audioRecorder.stop).toBeDefined()
  expect(audioRecorder.reset).toBeDefined()
  expect(audioRecorder.savePost).toBeDefined()
  expect(audioRecorder.saveComment).toBeDefined()
})

describe('mutators', () => {
  const { now } = Date
  const originalInterval = setInterval

  // clear all mocks
  // set jest timeout to 1000 to avoid jest.setTimeout.Timeout error
  // mock date to add interval value to current date
  // because jest.advanceTimersByTime(5000) doesn't handle it for us
  // see https://github.com/facebook/jest/issues/2684
  beforeEach(() => {
    jest.clearAllMocks()
    jest.setTimeout(10000)
    let time = now()
    Date.now = () => time
    const fakeInterval = global.setInterval
    global.setInterval = (fn, interval) => (
      fakeInterval((...args) => {
        time += interval
        fn(...args)
      }, interval)
    )
  })
  afterEach(() => {
    Date.now = now
    global.setInterval = originalInterval
  })
  it('starts recording', async () => {
    const audioRecorder = createAudioRecorder()
    await act(async () => {
      await audioRecorder.start()
    })
    expect(audioRecorder.isRecording).toBe(true)
  })
  it('stops recording', async () => {
    const audioRecorder = createAudioRecorder()
    await act(async () => {
      await audioRecorder.start()
      await audioRecorder.stop()
    })
    expect(audioRecorder.isRecording).toBe(false)
  })
  it('has recording if minduration condition is met', async () => {
    const audioRecorder = createAudioRecorder(undefined, 0, 10)
    await act(async () => {
      await audioRecorder.start()
      await audioRecorder.stop()
    })
    expect(audioRecorder.hasRecording).toBe(true)
  })
  it('resets recording if minduration condition is not met', async () => {
    const audioRecorder = createAudioRecorder(undefined, 10, 10)
    await act(async () => {
      await audioRecorder.start()
      await audioRecorder.stop()
    })
    expect(audioRecorder.hasRecording).toBe(false)
    expect(audioRecorder.elapsedTime).toBe(0)
    expect(RNFetchBlob.fs.unlink).toBeCalledTimes(1)
  })
  it('handles maxduration', async () => {
    const audioRecorder = createAudioRecorder(undefined, 0, 1)
    await act(async () => {
      await audioRecorder.start()
      jest.advanceTimersByTime(5000)
    })
    expect(audioRecorder.isRecording).toBe(false)
  })
})

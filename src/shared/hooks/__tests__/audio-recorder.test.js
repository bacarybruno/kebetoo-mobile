import { render, act } from 'react-native-testing-library';
import RNFetchBlob from 'rn-fetch-blob';

import useAudioRecorder from '../audio-recorder';

jest.useFakeTimers();

/**
 * Audio Recorder hook
 * @param {String} uri a predefined audio uri
 * @param {Number} minDuration the min duration of the recorded audio
 * @param {*} maxDuration the max duration of the recorded audio
 */
const createAudioRecorder = (...props) => {
  const returnVal = {};
  const TestComponent = () => {
    Object.assign(returnVal, useAudioRecorder(...props));
    return null;
  };
  render(<TestComponent />);
  return returnVal;
};

it('is defined', () => {
  const audioRecorder = createAudioRecorder({ uri: null });
  // props
  expect(audioRecorder.hasRecording).toBeDefined();
  expect(audioRecorder.elapsedTime).toBeDefined();
  expect(audioRecorder.recordUri).toBeDefined();
  expect(audioRecorder.isRecording).toBeDefined();
  // mutators
  expect(audioRecorder.start).toBeDefined();
  expect(audioRecorder.stop).toBeDefined();
  expect(audioRecorder.reset).toBeDefined();
  expect(audioRecorder.savePost).toBeDefined();
  expect(audioRecorder.saveComment).toBeDefined();
});

describe('mutators', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('starts recording', async () => {
    const audioRecorder = createAudioRecorder();
    await act(async () => {
      await audioRecorder.start();
    });
    expect(audioRecorder.isRecording).toBe(true);
  });
  it('stops recording', async () => {
    const audioRecorder = createAudioRecorder();
    await act(async () => {
      await audioRecorder.start();
      await audioRecorder.stop();
    });
    expect(audioRecorder.isRecording).toBe(false);
  });
  it('has recording if minduration condition is met', async () => {
    const audioRecorder = createAudioRecorder(undefined, 0, 10);
    await act(async () => {
      await audioRecorder.start();
      await audioRecorder.stop();
    });
    expect(audioRecorder.hasRecording).toBe(true);
  });
  it('resets recording if minduration condition is not met', async () => {
    const audioRecorder = createAudioRecorder(undefined, 10, 10);
    await act(async () => {
      await audioRecorder.start();
      await audioRecorder.stop();
    });
    expect(audioRecorder.hasRecording).toBe(false);
    expect(audioRecorder.elapsedTime).toBe(0);
    expect(RNFetchBlob.fs.unlink).toBeCalledTimes(1);
  });
  it('handles maxduration', async () => {
    const audioRecorder = createAudioRecorder(undefined, 0, 1);
    await act(async () => {
      await audioRecorder.start();
      jest.advanceTimersByTime(5000);
      await new Promise((resolve) => setImmediate(resolve));
    });
    expect(audioRecorder.isRecording).toBe(false);
  });
});

import { useState, useEffect, useCallback } from 'react';
import { Recorder } from '@react-native-community/audio-toolkit';
import RNFetchBlob from 'rn-fetch-blob';
import dayjs from 'dayjs';
import Sound from 'react-native-sound';
import { LogBox } from 'react-native';

import { api, permissions } from '@app/shared/services';
import { getExtension, getFileName, getMimeType } from '@app/shared/helpers/file';
import BackgroundTimer from '@app/shared/helpers/background-timer';
import { env } from '@app/config';

LogBox.ignoreLogs([
  'Warning: Cannot update a component from inside the function body of a different component.',
]);

export const MIN_DURATION_IN_SECONDS = 1;
export const MAX_DURATION_IN_SECONDS = env.maxLength.post.audio;
export const RECORD_NAME = 'PTT.mp4';
export const RECORD_CONFIG = Object.freeze({
  bitrate: 24000,
  sampleRate: 16000,
  channels: 2,
  quality: 'medium',
});
export const constructFileName = (time, duration, extension) => (
  // TODO: check if it's necessary to have unique file names
  `PTT-${time}-${duration}.${extension}`
);
export const extractMetadataFromName = (name) => {
  const extension = getExtension(name);
  const [prefix, time, duration] = name.replace(extension, '').split('-');
  return {
    prefix, time, duration,
  };
};

export const extractMetadataFromUrl = (url) => {
  const name = getFileName(url).split('.')[0];
  const [prefix, time, duration] = name.split('_');
  return {
    prefix, time, duration,
  };
};

let recorder = null;
let timerId = null;

const prepareRecorderAsync = (r) => (
  new Promise((resolve, reject) => {
    r.prepare((err, path) => {
      if (err) return reject(err);
      return resolve(path);
    });
  })
);

/**
 * Audio Recorder hook
 * @param {String} uri a predefined audio uri
 * @param {Number} minDuration the min duration of the recorded audio
 * @param {Number} maxDuration the max duration of the recorded audio
 */
const useAudioRecorder = (
  uri,
  minDurationInSeconds = MIN_DURATION_IN_SECONDS,
  maxDurationInSeconds = MAX_DURATION_IN_SECONDS,
) => {
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(uri !== undefined);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [recordUri, setRecordUri] = useState(uri);

  const savePost = useCallback(async (author, content, repost) => {
    const time = dayjs().format('YYYYMMDD');
    let duration = null;
    if (uri) {
      duration = await new Promise((resolve, reject) => {
        const sound = new Sound(uri, undefined, (err) => {
          if (err) reject(err);
          else resolve(Math.round(sound.getDuration()));
        });
      });
    }
    const response = await api.posts.createAudio({
      author,
      content,
      audio: {
        uri: recordUri,
        mimeType: getMimeType(recordUri),
        name: constructFileName(time, duration || elapsedTime, getExtension(recordUri)),
      },
      repost,
    });
    setHasRecording(false);
    await RNFetchBlob.fs.unlink(recordUri);
    return response;
  }, [elapsedTime, recordUri, uri]);

  const saveComment = useCallback(async (post, author, toReply) => {
    const time = dayjs().format('YYYYMMDD');
    const response = await api.comments.createAudio({
      post: toReply ? null : post,
      thread: toReply ? toReply.id : null,
      author,
      audio: {
        uri: recordUri,
        mimeType: getMimeType(recordUri),
        name: constructFileName(time, elapsedTime, getExtension(recordUri)),
      },
    });
    setHasRecording(false);
    await RNFetchBlob.fs.unlink(recordUri);
    return response;
  }, [elapsedTime, recordUri]);

  const saveStoryComment = useCallback(async (story, author, toReply) => {
    const time = dayjs().format('YYYYMMDD');
    const response = await api.comments.createAudio({
      story: toReply ? null : story,
      thread: toReply ? toReply.id : null,
      author,
      audio: {
        uri: recordUri,
        mimeType: getMimeType(recordUri),
        name: constructFileName(time, elapsedTime, getExtension(recordUri)),
      },
    });
    setHasRecording(false);
    await RNFetchBlob.fs.unlink(recordUri);
    return response;
  }, [elapsedTime, recordUri]);

  const start = useCallback(async () => {
    const { isNew, success } = await permissions.recordAudio();
    if (isNew || !success) return;
    recorder = new Recorder(RECORD_NAME, RECORD_CONFIG);
    const path = await prepareRecorderAsync(recorder);
    recorder.record();
    setRecordUri(path);
    setIsRecording(true);
  }, []);

  const reset = useCallback(async () => {
    await RNFetchBlob.fs.unlink(recordUri);
    setHasRecording(false);
    setElapsedTime(0);
  }, [recordUri]);

  const saveAsset = useCallback(async () => {
    const time = dayjs().format('YYYYMMDD');
    const response = await api.assets.createAudio({
      audio: {
        uri: recordUri,
        mimeType: getMimeType(recordUri),
        name: constructFileName(time, elapsedTime, getExtension(recordUri)),
      },
    });
    reset();
    return response[0].url;
  }, [elapsedTime, recordUri, reset]);

  const stop = useCallback(() => {
    BackgroundTimer.clearInterval(timerId);
    timerId = null;
    setIsRecording(false);
    if (recorder) {
      recorder.stop(() => {
        if (elapsedTime < minDurationInSeconds) return reset();
        return setHasRecording(true);
      });
    }
  }, [elapsedTime, minDurationInSeconds, reset]);

  useEffect(() => {
    if (isRecording) {
      timerId = BackgroundTimer.setInterval(() => {
        setElapsedTime((state) => state + 1);
      }, 1000);
    }
    return () => {
      BackgroundTimer.clearInterval(timerId);
      timerId = null;
    };
  }, [isRecording]);

  useEffect(() => {
    if (elapsedTime >= maxDurationInSeconds) {
      setIsRecording(false);
    }
  }, [elapsedTime, maxDurationInSeconds]);

  return {
    start,
    stop,
    reset,
    savePost,
    saveAsset,
    saveComment,
    saveStoryComment,
    recordUri,
    elapsedTime,
    isRecording,
    hasRecording,
  };
};

export default useAudioRecorder;

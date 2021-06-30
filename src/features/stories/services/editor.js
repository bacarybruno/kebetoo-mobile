/* eslint-disable max-len */
import { RNFFmpeg, RNFFprobe, RNFFmpegConfig } from 'react-native-ffmpeg';
import RNFetchBlob from 'rn-fetch-blob';

import { getExtension, getFileName } from '@app/shared/helpers/file';
import { env } from '@app/config';

const disableLogs = true;
if (disableLogs) {
  // RNFFmpegConfig.disableStatistics()
  RNFFmpegConfig.disableLogs();
}

// isnpired by https://github.com/shahen94/react-native-video-processing/blob/master/android/src/main/java/com/shahenlibrary/Trimmer/Trimmer.java
const rootDir = RNFetchBlob.fs.dirs.DocumentDir;
const fastPreset = '-preset ultrafast -crf 28 -profile:v baseline';
const pixFmt = '-pix_fmt yuv420p';
const outputDir = `${rootDir}/kebetoo-ffmpeg-cache-dir`;
export const getOutputPath = () => `${outputDir}/${Date.now()}.mp4`;

const videoEditor = {
  executeRawFFmpegCommand: async (command) => {
    const commandArgs = command.split(' ');
    const commandOutput = commandArgs.pop();
    const ffmpegCommand = `-y ${commandArgs.join(' ')} ${commandOutput}`;
    return new Promise((resolve, reject) => (
      RNFFmpeg.executeAsync(ffmpegCommand, (result) => {
        if (result.returnCode !== 0) return reject(result);
        return resolve(result);
      })
    ));
  },

  executeFFmpegCommand: async (input, command, commandOutput) => {
    let output = commandOutput;
    if (input === output) {
      const outputExtension = getExtension(output);
      const outputFileName = getFileName(output).replace(`.${outputExtension}`, '');
      output = `${rootDir}/${outputFileName}-${Date.now()}.${outputExtension}`;
    }
    await videoEditor.executeRawFFmpegCommand(`-i "${input}" ${command} "${output}"`);
    if (input === output) {
      await RNFetchBlob.fs.unlink(input);
      await RNFetchBlob.fs.mv(output, input);
    }
  },

  compose: async (initialParam, ...operations) => {
    let lastResult = initialParam;
    // eslint-disable-next-line no-restricted-syntax
    for (const operation of operations) {
      // eslint-disable-next-line no-await-in-loop
      lastResult = await operation(lastResult);
    }
    return lastResult;
  },

  // cleanup: async (args) => {
  //   await RNFetchBlob.fs.unlink(outputDir).catch(() => { })
  //   await RNFetchBlob.fs.mkdir(outputDir).catch(() => { })
  //   return args
  // },

  // cleanup: async () => {
  //   await RNFetchBlob.fs.unlink(outputDir).catch(() => { })
  //   return videos
  // },

  addSingleVideoEmptySoundIfNeeded: async (video, outputFile = getOutputPath()) => {
    if (!video.mute) return video;
    const generateSilenceArgs = `-f lavfi -i aevalsrc=0 -i ${video.uri} ${fastPreset} -c:v copy -c:a aac -map 0 -map 1:v -shortest ${outputFile}`;
    await videoEditor.executeRawFFmpegCommand(generateSilenceArgs);
    return { ...video, uri: outputFile };
  },

  addMultipleVideosEmptySoundIfNeeded: async (videos) => {
    const results = await Promise.all(videos.map((video) => videoEditor.addSingleVideoEmptySoundIfNeeded(video)));
    return results;
  },

  removeSingleVideoMetadata: async (video, outputFile = getOutputPath()) => {
    const removeMetadataArgs = `-metadata:s:v rotate=0 ${fastPreset}`;
    await videoEditor.executeFFmpegCommand(video.uri, removeMetadataArgs, outputFile);
    return { ...video, uri: outputFile };
  },

  mirrorSingleVideo: async (video, outputFile = getOutputPath()) => {
    if (!video.shouldMirror) return video;
    const mirrorVideoArgs = `-vf hflip ${fastPreset} -c:a copy`;
    await videoEditor.executeFFmpegCommand(video.uri, mirrorVideoArgs, outputFile);
    return { ...video, uri: outputFile };
  },

  flipSingleVideo: async (video) => {
    let result = await videoEditor.removeSingleVideoMetadata(video);
    result = videoEditor.mirrorSingleVideo(result);
    return result;
  },

  flipMultipleVideos: async (videos) => {
    const results = await Promise.all(videos.map((video) => videoEditor.flipSingleVideo(video)));
    return results;
  },

  setSingleVideoSpeed: async (video, outputFile = getOutputPath()) => {
    const { speed, uri: videoUri } = video;
    if (speed === 1) return video;

    let videoSpeedCmd = `[0:v]setpts=${speed.toFixed(1)}*PTS[v]`;
    let audioSpeedCmd = `[0:a]atempo=${speed.toFixed(1)}[a]`;

    if (speed === 0.3) audioSpeedCmd = '[0:a]atempo=0.6,atempo=0.5[a]';
    if (speed < 1) videoSpeedCmd = `[0:v]setpts=${(speed * 10).toFixed(1)}*PTS[v]`;
    else videoSpeedCmd = `[0:v]setpts=${(speed / 10).toFixed(1)}*PTS[v]`;

    const setVideoSpeedArgs = `-filter_complex "${videoSpeedCmd};${audioSpeedCmd}" ${fastPreset} ${pixFmt} -map "[v]" -map "[a]"`;

    await videoEditor.executeFFmpegCommand(videoUri, setVideoSpeedArgs, outputFile);
    return { ...video, uri: outputFile };
  },

  setMultipleVideosSpeed: async (videos) => {
    const results = await Promise.all(videos.map((video) => videoEditor.setSingleVideoSpeed(video)));
    return results;
  },

  mergeMultipleVideos: async (videos, outputFile = getOutputPath()) => {
    if (videos.length === 1) return { uri: videos[0].uri };
    const concatData = videos.map((video) => `file ${video.uri}`).join('\n');
    const concatFilePath = `${outputDir}/concat.txt`;
    await RNFetchBlob.fs.unlink(concatFilePath).catch(() => { });
    await RNFetchBlob.fs.writeFile(concatFilePath, concatData);
    await videoEditor.executeRawFFmpegCommand(`-safe 0 -f concat -i ${concatFilePath} ${fastPreset} -c copy ${outputFile}`);
    return { uri: outputFile };
  },

  compressVideo: async (video, outputFile = getOutputPath()) => {
    const { width: maxWidth, height: maxHeight } = env.stories.aspectRatio;
    const compressVideoArgs = `-filter:v "scale='min(${maxWidth},iw)':min'(${maxHeight},ih)':force_original_aspect_ratio=decrease,pad=${maxWidth}:${maxHeight}:(ow-iw)/2:(oh-ih)/2" ${fastPreset} ${pixFmt}`;
    // const compressVideoArgs = `-vcodec libx264 ${fastPreset} ${pixFmt}`
    // const compressVideoArgs = `-vf "scale=iw/2:ih/2" ${fastPreset} ${pixFmt}`
    await videoEditor.executeFFmpegCommand(video.uri, compressVideoArgs, outputFile);
    return { uri: outputFile };
  },

  boomerang: async (video, outputFile = getOutputPath()) => {
    const boomerangVideoArgs = `-filter_complex "[0:v]reverse,fifo[r];[0:v][0:a][r] [0:a]concat=n=2:v=1:a=1 [v] [a]" ${fastPreset} ${pixFmt} -map "[v]" -map "[a]"`;
    await videoEditor.executeFFmpegCommand(video.uri, boomerangVideoArgs, outputFile);
    return { uri: outputFile };
  },

  reverse: async (video, outputFile = getOutputPath()) => {
    const reverseVideoArgs = `${fastPreset} ${pixFmt} -vf reverse -c:a copy`;
    await videoEditor.executeFFmpegCommand(video.uri, reverseVideoArgs, outputFile);
    return { uri: outputFile };
  },

  slowmo: async (video, videoDuration, outputFile = getOutputPath()) => {
    const bounds = {
      start: 0,
      middleLeft: (videoDuration * 1) / 3,
      middleRight: (videoDuration * 2) / 3,
    };

    const slowmoVideoArgs = ''
      + `-filter_complex "[0:v]trim=${bounds.start}:${bounds.middleLeft},setpts=PTS-STARTPTS[v1];`
      + `[0:v]trim=${bounds.middleLeft}:${bounds.middleRight},setpts=2*(PTS-STARTPTS)[v2];`
      + `[0:v]trim=${bounds.middleRight},setpts=PTS-STARTPTS[v3];`
      + `[0:a]atrim=${bounds.start}:${bounds.middleLeft},asetpts=PTS-STARTPTS[a1];`
      + `[0:a]atrim=${bounds.middleLeft}:${bounds.middleRight},asetpts=PTS-STARTPTS,atempo=0.5[a2];`
      + `[0:a]atrim=${bounds.middleRight},asetpts=PTS-STARTPTS[a3];`
      + `[v1][a1][v2][a2][v3][a3]concat=n=3:v=1:a=1" ${fastPreset} ${pixFmt}`;

    await videoEditor.executeFFmpegCommand(video.uri, slowmoVideoArgs, outputFile);
    return { uri: outputFile };
  },

  getVideoProperties: async (video) => {
    const result = await RNFFprobe.getMediaInformation(video.uri);
    return result.getMediaProperties();
  },

  getDuration: async (video) => {
    const result = await videoEditor.getVideoProperties(video);
    return result.duration;
  },

  isMute: async (video) => {
    const result = await videoEditor.getVideoProperties(video);
    return result.nb_streams === 1;
  },

  overlayVideo: async (overlay, video, outputFile = getOutputPath()) => {
    const overlayVideoArgs = `-i ${overlay} -filter_complex "[0:v][1:v] overlay=0:0:enable='between(t,0,20)'" ${fastPreset} ${pixFmt} -c:a copy`;
    await videoEditor.executeFFmpegCommand(video.uri, overlayVideoArgs, outputFile);
    return { uri: outputFile };
  },

  overlayVideoWithImage: (overlay) => (video, outputFile = getOutputPath()) => videoEditor.overlayVideo(overlay, video, outputFile),
};

export default videoEditor;

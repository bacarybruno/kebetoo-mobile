import { useCallback, useState, useEffect } from 'react';
import dayjs from 'dayjs';
import RNFetchBlob from 'rn-fetch-blob';
import { useNavigation } from '@react-navigation/native';

import { api } from '@app/shared/services';
import { getExtension, getMimeType, isVideo } from '@app/shared/helpers/file';
import { CameraRollPicker } from '@app/shared/components';
import routes from '@app/navigation/routes';

export const constructFileName = (time, prefix = 'IMG', extension, duration) => {
  let fileName = `${prefix}-${time}`;
  if (duration) {
    fileName = `${fileName}-${duration}`;
  }
  fileName = `${fileName}.${extension}`;
  return fileName;
};

const useFilePicker = (uri) => {
  const [file, setFile] = useState(null);
  const { navigate } = useNavigation();

  const pickImage = useCallback(async () => {
    const fileData = await new Promise((resolve) => {
      // TODO: handle back button press without selecting an item
      navigate(routes.CAMERA_ROLL_PICKER, {
        assetType: CameraRollPicker.AssetTypes.Photos,
        onSelectedItem: (item) => {
          if (item) resolve(item);
          resolve(false);
        },
      });
    });
    if (fileData) setFile(fileData);
    return fileData;
  }, [navigate]);

  const pickVideo = useCallback(async () => {
    const fileData = await new Promise((resolve) => {
      navigate(routes.CAMERA_ROLL_PICKER, {
        assetType: CameraRollPicker.AssetTypes.Videos,
        onSelectedItem: (item) => {
          resolve(item || false);
        },
      });
    });
    if (fileData) setFile(fileData);
    return fileData;
  }, [navigate]);

  useEffect(() => {
    if (uri) {
      setFile({
        uri: uri.startsWith('file://') ? uri : `file://${uri}`,
        type: getMimeType(uri),
      });
    }
  }, [uri]);

  const reset = useCallback(async () => {
    if (file) {
      try {
        if (!isVideo(file.uri)) {
          await RNFetchBlob.fs.unlink(file.uri);
        }
      } finally {
        setFile(null);
      }
    }
  }, [file]);

  const saveImage = useCallback(async () => {
    const fileData = await pickImage();
    const time = dayjs().format('YYYYMMDD');
    const fileUri = fileData.uri.replace('file://', '');
    const response = await api.assets.createImage({
      image: {
        uri: fileUri,
        mimeType: fileData.type,
        name: constructFileName(time, 'IMG', getExtension(fileUri)),
      },
    });
    reset();
    return response[0].url;
  }, [pickImage, reset]);

  const savePost = useCallback(async (author, content, repost) => {
    // TODO: check if it's necessary to have unique file names
    const time = dayjs().format('YYYYMMDD');
    const fileUri = file.uri.replace('file://', '');
    let response;
    if (isVideo(file.uri)) {
      response = await api.posts.createVideo({
        author,
        content,
        video: {
          uri: fileUri,
          mimeType: file.type,
          name: constructFileName(time, 'VID', getExtension(fileUri), file.duration),
        },
        repost,
      });
    } else {
      response = await api.posts.createImage({
        author,
        content,
        image: {
          uri: fileUri,
          mimeType: file.type,
          name: constructFileName(time, 'IMG', getExtension(fileUri)),
        },
        repost,
      });
    }
    await reset();
    return response;
  }, [file, reset]);

  const saveFeedback = useCallback(async (author, content, repost) => {
    // TODO: check if it's necessary to have unique file names
    const time = dayjs().format('YYYYMMDD');
    const fileUri = file.uri.replace('file://', '');
    const response = await api.feedbacks.createImage({
      author,
      content,
      image: {
        uri: fileUri,
        mimeType: file.type,
        name: constructFileName(time, 'IMG', getExtension(fileUri)),
      },
      repost,
    });
    await reset();
    return response;
  }, [file, reset]);

  const saveStory = useCallback(async (author, content) => {
    const time = dayjs().format('YYYYMMDD');
    const fileUri = file.uri.replace('file://', '');
    const response = await api.stories.createVideo({
      author,
      content,
      video: {
        uri: fileUri,
        mimeType: file.type,
        name: constructFileName(time, 'VID', getExtension(fileUri)),
      },
    });
    await reset();
    return response;
  }, [file, reset]);

  return {
    file,
    hasFile: file !== null,
    type: isVideo(file?.uri) ? 'video' : 'image',
    reset,
    savePost,
    saveImage,
    pickImage,
    pickVideo,
    saveFeedback,
    saveStory,
  };
};

export default useFilePicker;

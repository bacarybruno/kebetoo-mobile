
import { useEffect, useReducer, useRef } from 'react';
import {
  Image, Platform, TouchableOpacity, View,
} from 'react-native';
import Video from 'react-native-video';
import { captureRef } from 'react-native-view-shot';
import { FlatList } from 'react-native-gesture-handler';
import RNFetchBlob from 'rn-fetch-blob';
import { useIsFocused } from '@react-navigation/native';

import { AppHeader, BottomSheetView, NoContent } from '@app/shared/components';
import { useAppColors, useAppStyles } from '@app/shared/hooks';
import { videoEditor } from '@app/features/stories/services';
import StoryViewActionBar from '@app/features/stories/components/actions-bar';
import StoryTextDesigner from '@app/features/stories/components/text-designer';
import StoryImageDesigner from '@app/features/stories/components/image-designer';
import { strings } from '@app/config';

import reducer, { initialState } from './reducer';
import createThemedStyles from './styles';

const VideoModes = {
  Normal: 'Normal',
  Boomerang: 'Boomerang',
  Reverse: 'Reverse',
  Slowmo: 'Slowmo',
};

const StickersPicker = ({ data, onPickSticker }) => {
  const styles = useAppStyles(createThemedStyles);

  const renderSticker = ({ item }) => {
    const stickerUri = `file://${item.path}`;
    return (
      <TouchableOpacity
        style={styles.sticker}
        onPress={() => onPickSticker({ ...item, uri: stickerUri })}
      >
        <Image source={{ uri: stickerUri }} style={styles.stickerImage} />
      </TouchableOpacity>
    );
  };

  const keyExtractor = (item) => item.filename;

  const renderListEmpty = () => (
    <NoContent
      title={strings.general.no_content}
      text="No sticker pack found on this device"
    />
  );

  return (
    <FlatList
      data={data}
      renderItem={renderSticker}
      keyExtractor={keyExtractor}
      style={styles.panelWrapper}
      numColumns={3}
      ListEmptyComponent={renderListEmpty}
      contentContainerStyle={{ flexGrow: 1 }}
    />
  );
};

const StickersBottomSheet = ({ bottonSheetRef, data, onPickSticker }) => (
  <BottomSheetView bottomSheet={bottonSheetRef} header="Stickers">
    <StickersPicker data={data} onPickSticker={onPickSticker} />
  </BottomSheetView>
);

// TODO: use reducer
const StoryPreview = ({ records, onGoBack, onFinish }) => {
  const { colors } = useAppColors();
  const styles = useAppStyles(createThemedStyles);

  const isFocused = useIsFocused();

  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    videoIndex,
    mergedVideo,
    processing,
    boomerangVideo,
    reversedVideo,
    slowMoVideo,
    videoMode,
    showActions,
    stickers,
  } = state;

  const storyTextDesigner = useRef();
  const storyImageDesigner = useRef();
  const viewShot = useRef();
  const bottomSheet = useRef();

  useEffect(() => {
    const fetchStickers = async () => {
      if (Platform.OS !== 'android') return;
      const waStickersPath = '/WhatsApp/Media/Whatsapp Stickers';
      let rawStickers = await RNFetchBlob.fs.lstat(RNFetchBlob.fs.dirs.SDCardDir + waStickersPath);
      rawStickers = rawStickers.sort((a, b) => b.lastModified - a.lastModified);
      dispatch({ type: 'setStickers', payload: rawStickers.slice(0, 99) });
    };

    fetchStickers();
  }, []);

  useEffect(() => {
    const createBoomerangVideo = async (video) => {
      const result = await videoEditor.boomerang(video);
      dispatch({ type: 'setBoomerangVideo', payload: result });
    };

    const createReversedVideo = async (video) => {
      const result = await videoEditor.reverse(video);
      dispatch({ type: 'setReversedVideo', payload: result });
    };

    const createSlowMoVideo = async (video, videoDuration) => {
      const result = await videoEditor.slowmo(video, videoDuration);
      dispatch({ type: 'setSlowMoVideo', payload: result });
    };

    const mergeVideos = async () => {
      dispatch({ type: 'setProcessing', payload: true });

      const result = await videoEditor.compose(
        records,
        videoEditor.flipMultipleVideos,
        videoEditor.addMultipleVideosEmptySoundIfNeeded,
        videoEditor.setMultipleVideosSpeed,
        videoEditor.mergeMultipleVideos,
      );

      dispatch({ type: 'setMergedVideo', payload: result });

      const videoDuration = await videoEditor.getDuration(result);

      await Promise.all([
        createSlowMoVideo(result, videoDuration),
        createBoomerangVideo(result),
        createReversedVideo(result),
      ]);

      dispatch({ type: 'setProcessing', payload: false });
    };

    mergeVideos();
  }, [records]);

  const loadNextVideo = () => {
    const nextVideoIndex = videoIndex + 1;
    dispatch({
      type: 'setVideoIndex',
      payload: nextVideoIndex < records.length
        ? nextVideoIndex
        : 0,
    });
  };

  const updateVideoMode = (mode) => {
    dispatch({
      type: 'setVideoMode',
      payload: videoMode === mode
        ? VideoModes.Normal
        : mode,
    });
  };

  const getDisplayedVideo = () => {
    let video = records[videoIndex];
    if (mergedVideo) video = mergedVideo;
    if (videoMode === VideoModes.Boomerang) video = boomerangVideo;
    if (videoMode === VideoModes.Reverse) video = reversedVideo;
    if (videoMode === VideoModes.Slowmo) video = slowMoVideo;
    return video;
  };

  const actions = [{
    icon: 'text',
    text: 'Text',
    onPress: () => storyTextDesigner.current.addNode(),
  }, {
    icon: 'happy',
    text: 'Stickers',
    onPress: () => bottomSheet.current?.expand(),
  }, {
    icon: 'infinite',
    text: 'B∞mrang',
    disabled: !boomerangVideo,
    active: videoMode === VideoModes.Boomerang,
    onPress: () => updateVideoMode(VideoModes.Boomerang),
  }, {
    icon: 'play-back',
    text: 'Reverse',
    disabled: !reversedVideo,
    active: videoMode === VideoModes.Reverse,
    onPress: () => updateVideoMode(VideoModes.Reverse),
  }, {
    icon: 'hourglass',
    text: 'Slowmo',
    disabled: !slowMoVideo,
    active: videoMode === VideoModes.Slowmo,
    onPress: () => updateVideoMode(VideoModes.Slowmo),
  }, {
    icon: 'arrow-forward-circle',
    text: 'Next',
    disabled: !mergedVideo,
    onPress: async () => {
      dispatch({ type: 'setProcessing', payload: true });
      const captured = await captureRef(viewShot.current);
      const result = await videoEditor.compose(
        getDisplayedVideo(),
        videoEditor.overlayVideoWithImage(captured),
        videoEditor.compressVideo,
      );
      dispatch({ type: 'setProcessing', payload: false });
      onFinish(result);
    },
  }];

  const onPickSticker = (sticker) => {
    storyImageDesigner.current.addNode(sticker);
    bottomSheet.current?.close();
  };

  const blurDesigner = () => {
    storyTextDesigner.current.blurAll();
    storyImageDesigner.current.blurAll();
  };

  const video = getDisplayedVideo();

  if (!isFocused) return null;

  return (
    <>
      <View style={styles.wrapper}>
        <Video
          repeat
          source={video}
          key={video.uri}
          muted={video.mute}
          rate={video.speed}
          resizeMode="cover"
          style={styles.video}
          onEnd={loadNextVideo}
        />
        <AppHeader
          headerBack
          style={styles.previewHeader}
          iconColor={colors.white}
          titleStyle={{ color: colors.white }}
          onGoBack={onGoBack}
          loading={processing}
          title={
            processing
              ? strings.virals.preparing_state
              : strings.virals.preview_state
          }
        />
        <TouchableOpacity
          ref={viewShot}
          style={styles.viewshot}
          collapsable={false}
          onPress={blurDesigner}
          activeOpacity={1}
        >
          <StoryTextDesigner
            onFocus={() => dispatch({ type: 'setShowActions', payload: false })}
            onBlur={() => dispatch({ type: 'setShowActions', payload: true })}
            ref={storyTextDesigner}
          />
          <StoryImageDesigner
            onFocus={() => dispatch({ type: 'setShowActions', payload: false })}
            onBlur={() => dispatch({ type: 'setShowActions', payload: true })}
            ref={storyImageDesigner}
          />
        </TouchableOpacity>
        {showActions && <StoryViewActionBar actions={actions} />}
      </View>
      {showActions && (
        <StickersBottomSheet
          data={stickers}
          bottonSheetRef={bottomSheet}
          onPickSticker={onPickSticker}
        />
      )}
    </>
  );
};

export default StoryPreview;

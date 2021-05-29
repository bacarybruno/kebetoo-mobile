
import { useCallback, useEffect, useReducer, useRef, useState } from 'react'
import { Image, Text, View } from 'react-native'
import { RNCamera } from 'react-native-camera'
import Ionicon from 'react-native-vector-icons/Ionicons'
import RNFetchBlob from 'rn-fetch-blob'
import CameraRoll from '@react-native-community/cameraroll'

import { AppHeader, Typography } from '@app/shared/components'
import { useAppColors, useAppStyles } from '@app/shared/hooks'
import BackgroundTimer from '@app/shared/helpers/background-timer'
import { permissions } from '@app/shared/services'
import { ProgressIndicator } from '@app/features/stories/components/slide'
import StoryViewActionBar from '@app/features/stories/components/actions-bar'
import RecordButton from '@app/features/stories/components/record-button'
import FrontCameraFlash from '@app/features/stories/components/front-camera-flash'
import { videoEditor } from '@app/features/stories/services'
import { metrics } from '@app/theme'

import reducer, { initialState } from './reducer'
import createThemedStyles from './styles'

const minVideoDurationInSeconds = 1
const videoBitrate = 516 * 1024

const RecordState = {
  Unprocessed: -1,
  Processing: 0,
  Processed: 1,
}

const CameraPreviewIcon = () => {
  const styles = useAppStyles(createThemedStyles)
  const [uri, setUri] = useState(null)

  useEffect(() => {
    const fetchCameraThumbnail = async () => {
      const preview = await CameraRoll.getPhotos({ first: 1, assetType: 'Videos' })
      setUri(preview.edges[0].node.image.uri)
    }

    fetchCameraThumbnail()
  }, [])

  return (
    <View style={styles.videoIconWrapper}>
      <Image
        source={{ uri }}
        style={styles.videoIcon}
        borderRadius={metrics.radius.round}
      />
    </View>
  )
}

const StoryDesigner = ({
  onFinish,
  onGoBack,
  pickVideoFile,
  pickedVideoFile,
  resetVideoFile,
}) => {
  const styles = useAppStyles(createThemedStyles)
  const { colors } = useAppColors()

  const camera = useRef()
  const [state, dispatch] = useReducer(reducer, initialState)
  const {
    flashOn,
    frontCamera,
    mute,
    speed,
    elapsedTime,
    isRecording,
    preparing,
    progress,
    records,
  } = state

  const recordTimer = useRef()

  const addRecord = ({ uri, mute = true, speed = 1, ...record }) => {
    const payload = {
      type: 'addRecord',
      payload: {
        uri,
        mute,
        speed,
        recordedAt: Date.now(),
        // shouldMirror: Platform.OS === 'android' && frontCamera,
        shouldMirror: false,
        state: RecordState.Unprocessed,
        ...record,
      }
    }
    dispatch(payload)
    return payload.payload
  }

  useEffect(() => {
    const addUploadedVideo = async () => {
      if (pickedVideoFile) {
        const mute = await videoEditor.isMute(pickedVideoFile)
        const payload = addRecord({ uri: pickedVideoFile.uri, mute })
        resetVideoFile()
        onFinish([payload])
      }
    }

    addUploadedVideo()
  }, [pickedVideoFile])

  let rightActions = [{
    icon: 'flash',
    text: 'Flash',
    active: flashOn,
    onPress: () => dispatch({ type: 'toggleFlash' })
  }, {
    icon: mute ? 'mic-off' : 'mic',
    text: 'Mute',
    onPress: () => dispatch({ type: 'toggleMute' })
  }, {
    icon: (
      <Typography
        text={speed.toString().replace(0, '') + 'x'}
        type={Typography.types.headline2}
        style={[styles.text, styles.textShadow]}
      />
    ),
    text: 'Speed',
    onPress: () => {
      const values = [0.5, 0.75, 1, 1.25, 1.5]
      const currentValueIndex = values.findIndex((value) => value === speed)
      const nextValueIndex = currentValueIndex + 1
      dispatch({ type: 'setSpeed', payload: values[nextValueIndex] ?? values[0] })
    }
  }, {
    icon: 'camera-reverse',
    text: 'Flip',
    onPress: () => dispatch({ type: 'flipCamera' })
  }]

  const nextAction = {
    icon: 'arrow-forward-circle',
    text: 'Next',
    disabled: preparing,
    onPress: () => {
      camera.current.pausePreview()
      onFinish(records)
    }
  }

  if (elapsedTime > minVideoDurationInSeconds) {
    rightActions.push(nextAction)
  }

  if (progress >= 1) {
    rightActions = [nextAction]
  }

  const leftActions = [{
    icon: <CameraPreviewIcon />,
    onPress: pickVideoFile,
  }]

  useEffect(() => {
    permissions.externalStorage()
  }, [])

  const startRecording = useCallback(() => {
    dispatch({ type: 'setIsRecording', payload: true })
    const interval = 100
    recordTimer.current = BackgroundTimer.setInterval(() => {
      dispatch({ type: 'incElapsedTime', payload: interval / 1000 })
    }, interval)
  }, [dispatch])

  const onRecord = useCallback(async () => {
    const recordPath = `${RNFetchBlob.fs.dirs.DocumentDir}/${Date.now()}.mp4`
    const record = await camera.current.recordAsync({
      path: recordPath,
      mute,
      orientation: RNCamera.Constants.Orientation.portrait,
      mirrorVideo: false,
    })
    addRecord({ ...record, uri: recordPath, mute, speed })
  }, [dispatch, mute, speed, frontCamera])

  const onEndRecord = useCallback(() => {
    camera.current.stopRecording()
  }, [])

  const endRecording = useCallback(() => {
    BackgroundTimer.clearInterval(recordTimer.current)
    dispatch({ type: 'endRecord' })
  }, [])

  useEffect(() => {
    if (progress >= 1) {
      onEndRecord()
    }
  }, [progress])

  const { VideoQuality, VideoCodec, Type: CameraType, FlashMode } = RNCamera.Constants

  const reloadButton = records.length > 0 && !preparing && (
    <Ionicon
      name="reload"
      size={30}
      color={colors.white}
      onPress={() => {
        dispatch({ type: 'reset' })
        camera.current.resumePreview()
      }}
    />
  )

  const closeButton = (
    <Ionicon
      name="close-outline"
      size={30}
      color={colors.white}
      onPress={() => {
        dispatch({ type: 'reset' })
        onGoBack()
      }}
    />
  )

  return (
    <RNCamera
      ref={camera}
      useNativeZoom
      style={styles.wrapper}
      codec={VideoCodec?.H264}
      videoBitrate={videoBitrate} // 516 kbps
      onRecordingEnd={endRecording}
      onRecordingStart={startRecording}
      defaultVideoQuality={VideoQuality['480p']}
      onDoubleTap={() => dispatch({ type: 'flipCamera' })}
      flashMode={flashOn ? FlashMode.torch : FlashMode.off}
      type={frontCamera ? CameraType.front : CameraType.back}
    >
      <ProgressIndicator currentProgress={progress} animateColor />
      <AppHeader
        title={(
          isRecording
            ? 'Recording...'
            : preparing
              ? 'Preparing...'
              : records.length > 0
                ? `${records.length} Videos`
                : ''
        )}
        style={styles.padding}
        onGoBack={onGoBack}
        iconColor={colors.white}
        titleStyle={{ color: colors.white }}
        Right={reloadButton || closeButton}
      />
      {frontCamera && flashOn && isRecording && <FrontCameraFlash />}
      <RecordButton
        onRecord={onRecord}
        onEndRecord={onEndRecord}
        isRecording={isRecording}
        isDisabled={progress >= 1 || preparing}
      />
      {!isRecording && !preparing && <StoryViewActionBar actions={rightActions} />}
      {records.length === 0 && !isRecording && !preparing && (
        <StoryViewActionBar
          actions={leftActions}
          position={StoryViewActionBar.Positions.Left}
        />
      )}
    </RNCamera>
  )
}

export default StoryDesigner

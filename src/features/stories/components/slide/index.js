import {
  memo, useCallback, useEffect, useRef, useState,
} from 'react'
import { Image, Text, View } from 'react-native'
import Ionicon from 'react-native-vector-icons/Ionicons'
import Video from 'react-native-video'
import { useNavigation } from '@react-navigation/native'
import convertToProxyURL from 'react-native-video-cache'
import Share from 'react-native-share'
import RNFetchBlob from 'rn-fetch-blob'

import {
  Avatar, MultipleTapHandler, FormatedTypography, Typography, BottomSheetView,
} from '@app/shared/components'
import { readableNumber } from '@app/shared/helpers/strings'
import { useAppColors, useAppStyles, useUser } from '@app/shared/hooks'
import { colorGradient } from '@app/theme/colors'
import useStoriesReactions, { REACTION_TYPES } from '@app/features/stories/hooks/reactions'
import CommentsView from '@app/features/comments/components/comments-view'
import { getMimeType } from '@app/shared/helpers/file'

import { strings } from '@app/config'
import createThemedStyles from './styles'
import StoryViewActionBar from '../actions-bar'

import { useComments } from '../../hooks'

const StoryAuthor = ({ author }) => {
  const styles = useAppStyles(createThemedStyles)

  return (
    <View style={styles.storyAuthor}>
      <Avatar
        src={author.photoURL}
        text={author.displayName}
        size={25}
        fontSize={28}
      />
      <Text style={styles.authorName} numberOfLines={1}>
        <Typography
          text={`${author.username || author.displayName}`}
          color={Typography.colors.white}
          type={Typography.types.headline5}
          systemWeight={Typography.weights.semibold}
        />
        <Typography text=" • " color={Typography.colors.white} />
        <Typography
          text="Follow"
          color={Typography.colors.white}
          type={Typography.types.headline5}
          systemWeight={Typography.weights.semibold}
        />
      </Text>
    </View>
  )
}

const PlayButton = ({ visible }) => {
  const styles = useAppStyles(createThemedStyles)
  const { colors } = useAppColors()

  return (
    <View
      style={[styles.overlay, styles.controlsOverlay]}
      pointerEvents="none"
    >
      {visible && (
        <Ionicon
          name="play"
          size={70}
          color={colors.white}
          style={styles.icon}
        />
      )}
    </View>
  )
}

export const ProgressIndicator = ({ currentProgress, animateColor }) => {
  const styles = useAppStyles(createThemedStyles)
  const { colors } = useAppColors()

  let progressColor = colors.blue
  if (animateColor) {
    progressColor = colorGradient(currentProgress, colors.blue, colors.pink)
  }
  return (
    <View
      style={[
        styles.progress,
        { width: `${currentProgress * 100}%`, backgroundColor: progressColor },
      ]}
    />
  )
}

const Footer = ({ children }) => {
  const styles = useAppStyles(createThemedStyles)

  return (
    <View style={styles.footer}>
      {children}
    </View>
  )
}

export const CommentsCount = ({ count, onDismiss }) => {
  const styles = useAppStyles(createThemedStyles)
  const { colors } = useAppColors()

  return (
    <View style={styles.commentPanelHeader}>
      <Typography
        text={`${readableNumber(count)} comments`}
        systemWeight={Typography.weights.semibold}
        style={styles.text}
      />
      <Ionicon
        name="ios-close"
        color={colors.textPrimary}
        size={23}
        style={styles.modalCloseIcon}
        onPress={onDismiss}
      />
    </View>
  )
}

export const CommentsBottomSheet = ({
  story, count, bottomSheet, onBottomSheetIndexChange,
}) => {
  const commentInput = useRef()
  const scrollView = useRef()
  const navigation = useNavigation()

  const commentHelpers = useComments(
    story,
    commentInput,
    scrollView,
  )

  return (
    <BottomSheetView
      index={0}
      bottomSheet={bottomSheet}
      header={`${readableNumber(count)} comments`}
      onBottomSheetIndexChange={onBottomSheetIndexChange}
    >
      <CommentsView
        {...commentHelpers}
        navigation={navigation}
        scrollView={scrollView}
        commentInput={commentInput}
      />
    </BottomSheetView>
  )
}

const StorySlide = ({
  source,
  viewsCount = 3243,
  thumbnail,
  focused,
  withBlurOverlay = true,
  story,
}) => {
  const { author, content, comments } = story

  const styles = useAppStyles(createThemedStyles)
  const { colors } = useAppColors()

  const [paused, setPaused] = useState(false)
  const [commentsOpened, setCommentsOpened] = useState(false)

  const player = useRef()
  const bottomSheet = useRef()

  const {
    count, onReaction, userReactionType,
  } = useStoriesReactions({ story, author: author.id, comments })
  const { profile } = useUser()

  useEffect(() => {
    player.current?.seek(0)
    setPaused(false)
  }, [])

  const onPress = useCallback(() => setPaused((state) => !state), [])

  const onBottomSheetIndexChange = useCallback((index) => setCommentsOpened(index > 0), [])

  const actions = [{
    icon: 'eye',
    text: readableNumber(viewsCount),
  }, {
    icon: 'heart',
    activeColor: colors.heart,
    active: userReactionType === REACTION_TYPES.LOVE,
    text: readableNumber(count.loves),
    onPress: () => onReaction(REACTION_TYPES.LOVE),
  }, {
    icon: 'chatbubble',
    text: readableNumber(count.comments),
    onPress: () => bottomSheet.current.expand(),
  }, {
    icon: 'arrow-redo',
    text: readableNumber(count.shares),
    onPress: async () => {
      const type = getMimeType(source)
      const configOptions = { fileCache: true }
      const file = await RNFetchBlob.config(configOptions).fetch('GET', source)
      const filePath = file.path()
      let base64Data = await file.readFile('base64')
      base64Data = `data:${type};base64,${base64Data}`
      await Share.open({
        url: base64Data,
        title: strings.virals.share_title,
        message: strings.formatString(strings.virals.share_message, profile.displayName),
        type,
      })
      // remove the image from device's storage
      await RNFetchBlob.fs.unlink(filePath)
    },
  }]

  if (!focused) return null

  return (
    <>
      <View style={styles.page}>
        {withBlurOverlay && (
          <Image source={{ uri: thumbnail }} style={styles.overlay} blurRadius={30} />
        )}
        <Footer>
          <FormatedTypography
            numberOfLines={1}
            text={content}
            color={Typography.colors.white}
            revealType={Typography.types.body}
          />
          <StoryAuthor author={author} />
        </Footer>
        <MultipleTapHandler
          onPress={onPress}
          onDoublePress={() => onReaction(REACTION_TYPES.LOVE)}
          onLongPress={() => console.log('options')}
        >
          <View>
            <Video
              repeat
              poster={thumbnail}
              source={{ uri: convertToProxyURL(source) }}
              style={[styles.page, styles.video]}
              paused={!focused || paused || commentsOpened}
              ignoreSilentSwitch="ignore"
              progressUpdateInterval={1000}
              ref={player}
              playInBackground={false}
              playWhenInactive={false}
              useTextureView={false}
              onAudioBecomingNoisy={() => setPaused(true)}
            />
          </View>
        </MultipleTapHandler>
        <View style={[styles.overlay, styles.darkOverlay]} pointerEvents="box-none" />
        <PlayButton onPress={onPress} visible={paused} />
      </View>
      <StoryViewActionBar actions={actions} style={styles.actionBar} />
      {focused && (
        <CommentsBottomSheet
          story={story}
          count={count.comments}
          bottomSheet={bottomSheet}
          onBottomSheetIndexChange={onBottomSheetIndexChange}
        />
      )}
    </>
  )
}

export default memo(StorySlide)

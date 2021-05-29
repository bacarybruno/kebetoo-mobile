import { TouchableOpacity, View } from 'react-native'
import Ionicon from 'react-native-vector-icons/Ionicons'
import { useEffect, useRef, useState } from 'react'
import { useIsFocused } from '@react-navigation/core'
import PagerView from 'react-native-pager-view'
import RNFetchBlob from 'rn-fetch-blob'

import { AppHeader } from '@app/shared/components'
import { strings } from '@app/config'
import { useAppColors, useAppStyles } from '@app/shared/hooks'
import { api } from '@app/shared/services'
import { getVideoThumbnail } from '@app/features/post/components/video-content'
import useFilePicker from '@app/features/post/hooks/file-picker'
import StorySlide from '@app/features/stories/components/slide'
import { getOutputPath } from '@app/features/stories/services/editor'

import CreateStoryPage from './create'
import { useDarkBackground } from '../hooks'
import createThemedStyles from './styles'
import routes from '@app/navigation/routes'
import { actionTypes } from '@app/features/post/containers/create'

const getStories = ({ stories, currentStory, isFocused }) => {
  const items = stories.map((story, index) => {
    return (
      <View key={story.id}>
        <StorySlide
          story={story}
          thumbnail={getVideoThumbnail(story.video.url)}
          focused={isFocused && currentStory === index}
          source={story.video.url}
        />
      </View>
    )
  })

  return items
}

const routeOptions = { title: strings.tabs.stories }

const StoriesPage = ({ route, navigation }) => {
  const styles = useAppStyles(createThemedStyles)
  const { colors } = useAppColors()

  const pager = useRef()
  const [stories, setStories] = useState([])
  const [currentStory, setCurrentStory] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [pickedFile, setPickedFile] = useState(null)
  const { pickVideo } = useFilePicker()

  const isFocused = useIsFocused()
  useDarkBackground(isFocused, currentPage === 0)

  const pickVideoFile = async () => {
    const video = await pickVideo()
    const outputPath = getOutputPath()
    await RNFetchBlob.fs.cp(video.uri, outputPath)
    setPickedFile({ uri: outputPath })
  }

  const onPreviewFinish = (result) => {
    navigation.navigate(routes.CREATE_POST, {
      file: result.uri,
      action: actionTypes.CREATE_STORY,
    })
  }

  useEffect(() => {
    const fetchVideos = async () => {
      const videos = await api.stories.get({})
      setStories(videos)
    }

    fetchVideos()
  }, [])

  const onStoryPageSelected = e => setCurrentStory(e.nativeEvent.position)
  const onPageSelected = e => setCurrentPage(e.nativeEvent.position)

  if (!isFocused) return null

  const items = getStories({
    stories,
    currentStory,
    isFocused: isFocused && currentPage === 1,
  })

  const storiesPager = (
    <>
      {items.length > 0 && (
        <PagerView
          style={styles.wrapper}
          initialPage={0}
          orientation="vertical"
          onPageSelected={onStoryPageSelected}
        >
          {items}
        </PagerView>
      )}
      <AppHeader
        title={strings.tabs.stories}
        style={styles.header}
        titleStyle={styles.text}
        Right={(
          <TouchableOpacity onPress={() => pager.current.setPage(0)}>
            <Ionicon
              name="add"
              size={30}
              color={colors.white}
            />
          </TouchableOpacity>
        )}
      />
    </>
  )

  const createStoryPager = (
    <CreateStoryPage
      onGoBack={() => pager.current.setPage(1)}
      isFocused={currentPage === 0}
      pickVideoFile={pickVideoFile}
      resetVideoFile={() => setPickedFile(null)}
      pickedFile={pickedFile}
      onFinish={onPreviewFinish}
    />
  )

  return (
    <View style={styles.wrapper}>
      <PagerView
        orientation="horizontal"
        initialPage={currentPage}
        style={styles.wrapper}
        ref={pager}
        onPageSelected={onPageSelected}
      >
        <View key="create-story">{createStoryPager}</View>
        <View key="stories">{storiesPager}</View>
      </PagerView>
    </View>
  )
}

StoriesPage.routeOptions = routeOptions

export default StoriesPage

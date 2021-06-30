import { Platform, View, InteractionManager } from 'react-native'
import { useEffect, useRef, useState } from 'react'
import { useIsFocused } from '@react-navigation/native'
import RNFetchBlob from 'rn-fetch-blob'

import { strings } from '@app/config'
import { useAppStyles } from '@app/shared/hooks'
import { api } from '@app/shared/services'
import useFilePicker from '@app/features/post/hooks/file-picker'
import { getOutputPath } from '@app/features/stories/services/editor'
import { ViewPager } from '@app/shared/components'
import { actionTypes } from '@app/features/post/containers/create'
import routes from '@app/navigation/routes'

import CreateStoryPage from './create'
import { useDarkBackground } from '../hooks'
import createThemedStyles from './styles'
import StoryListPage from './story-list'

const routeOptions = { title: strings.tabs.stories }

const StoriesPage = ({ route, navigation }) => {
  const styles = useAppStyles(createThemedStyles)

  const pager = useRef()
  const [stories, setStories] = useState([])
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
    if (route.params?.mode === StoriesPage.Modes.CreateStory) {
      InteractionManager.runAfterInteractions(() => {
        pager.current.setPage(0)
      })
    }
  }, [route.params])

  useEffect(() => {
    const fetchVideos = async () => {
      const videos = await api.stories.get({})
      setStories(videos)
    }

    fetchVideos()
  }, [])

  const onPageSelected = (e) => setCurrentPage(e.nativeEvent.position)

  const isStoriesPageFocused = isFocused && currentPage === 1
  const isCreateStoryPageFocused = currentPage === 0

  const createKey = (key, focused) => `${key}-${Platform.OS === 'ios' ? focused : ''}`

  return (
    <View style={styles.wrapper}>
      <ViewPager
        ref={pager}
        style={styles.wrapper}
        orientation="horizontal"
        initialPage={currentPage}
        onPageSelected={onPageSelected}
      >
        <View key={createKey('create-story', isCreateStoryPageFocused)} collapsable={false}>
          <CreateStoryPage
            pickedFile={pickedFile}
            onFinish={onPreviewFinish}
            pickVideoFile={pickVideoFile}
            isFocused={isCreateStoryPageFocused}
            onGoBack={() => pager.current.setPage(1)}
            resetVideoFile={() => setPickedFile(null)}
          />
        </View>
        <View key={createKey('stories', isStoriesPageFocused)} collapsable={false}>
          <StoryListPage
            stories={stories}
            isFocused={isStoriesPageFocused}
            onAddStory={() => pager.current.setPage(0)}
          />
        </View>
      </ViewPager>
    </View>
  )
}

StoriesPage.Modes = {
  CreateStory: 'StoriesPage.Modes.CreateStory',
  Default: 'StoriesPage.Modes.Default',
}

StoriesPage.routeOptions = routeOptions

export default StoriesPage

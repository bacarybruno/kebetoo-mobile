import { useState } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { ViewPager } from '@app/shared/components'
import Ionicon from 'react-native-vector-icons/Ionicons'

import { AppHeader } from '@app/shared/components'
import { strings } from '@app/config'
import { useAppColors, useAppStyles } from '@app/shared/hooks'
import { getVideoThumbnail } from '@app/features/post/components/video-content'
import StorySlide from '@app/features/stories/components/slide'

import createThemedStyles from './styles'

const StoryItems = ({ stories, currentStory, isFocused }) => {
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


const StoryListPage = ({ onAddStory, stories, isFocused }) => {
  const styles = useAppStyles(createThemedStyles)
  const { colors } = useAppColors()

  const [currentStory, setCurrentStory] = useState(0)

  const onStoryPageSelected = e => setCurrentStory(e.nativeEvent.position)

  return (
    <>
      {stories.length > 0 && (
        <ViewPager
          initialPage={0}
          unmountOnBlur={true}
          style={styles.wrapper}
          orientation="vertical"
          onPageSelected={onStoryPageSelected}
        >
          <StoryItems
            stories={stories}
            isFocused={isFocused}
            currentStory={currentStory}
          />
        </ViewPager>
      )}
      <AppHeader
        title={strings.tabs.stories}
        style={styles.header}
        titleStyle={styles.text}
        Right={(
          <TouchableOpacity onPress={onAddStory}>
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
}

export default StoryListPage

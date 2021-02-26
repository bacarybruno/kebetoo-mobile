import React from 'react'
import { View } from 'react-native'

import { AppHeader } from '@app/shared/components'
import { strings } from '@app/config'
import { useAppStyles } from '@app/shared/hooks'

import createThemedStyles from './styles'

const routeOptions = { title: strings.tabs.stories }

const StoriesPage = ({ route, navigation }) => {
  const styles = useAppStyles(createThemedStyles)
  return (
    <View style={styles.wrapper}>
      <AppHeader
        title={strings.tabs.stories}
        text=""
        showAvatar={false}
        headerBack
      />
    </View>
  )
}

StoriesPage.routeOptions = routeOptions

export default StoriesPage

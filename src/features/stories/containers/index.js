import React from 'react'
import { View } from 'react-native'

import { Typography } from '@app/shared/components'
import { strings } from '@app/config'
import { useAppStyles } from '@app/shared/hooks'

import createThemedStyles from './styles'

const routeOptions = { title: strings.tabs.stories }

const StoriesPage = () => {
  const styles = useAppStyles(createThemedStyles)
  return (
    <View style={styles.wrapper}>
      <Typography type={Typography.types.headline4} text="Hello Stories" />
    </View>
  )
}

StoriesPage.routeOptions = routeOptions

export default StoriesPage

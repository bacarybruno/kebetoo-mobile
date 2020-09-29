import React from 'react'
import { View } from 'react-native'

import { Typography } from '@app/shared/components'
import { strings } from '@app/config'

import styles from './styles'

const routeOptions = { title: strings.tabs.stories }

const StoriesPage = () => (
  <View style={styles.wrapper}>
    <Typography type={Typography.types.headline4} text="Hello Stories" />
  </View>
)

StoriesPage.routeOptions = routeOptions

export default StoriesPage

import React from 'react'
import { View } from 'react-native'

import Typography, { types } from '@app/shared/components/typography'
import strings from '@app/config/strings'

import styles from './styles'

const routeOptions = { title: strings.tabs.stories }

const StoriesPage = () => (
  <View style={styles.wrapper}>
    <Typography type={types.headline4} text="Hello Stories" />
  </View>
)

StoriesPage.routeOptions = routeOptions

export default StoriesPage

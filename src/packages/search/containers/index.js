import React from 'react'
import { View } from 'react-native'

import Typography, { types } from 'Kebetoo/src/shared/components/typography'
import strings from 'Kebetoo/src/config/strings'

import styles from './styles'

const routeOptions = { title: strings.tabs.search }

const SearchPage = () => (
  <View style={styles.wrapper}>
    <Typography type={types.headline4} text="Hello Search" />
  </View>
)

SearchPage.routeOptions = routeOptions

export default SearchPage

import React from 'react'
import { View } from 'react-native'

import Text from 'Kebetoo/src/shared/components/text'
import strings from 'Kebetoo/src/config/strings'

import styles from './styles'

const routeOptions = { title: strings.tabs.search }

const SearchPage = () => (
  <View style={styles.wrapper}>
    <Text text="Hello Search" />
  </View>
)

SearchPage.routeOptions = routeOptions

export default SearchPage

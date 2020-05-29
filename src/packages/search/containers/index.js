import React from 'react'
import { View } from 'react-native'

import Text from 'Kebetoo/src/shared/components/text'
import strings from 'Kebetoo/src/config/strings'

import styles from './styles'

export const routeOptions = { title: strings.tabs.search }

const SearchPage = () => (
  <View style={styles.wrapper}>
    <Text text="Hello Search" />
  </View>
)

export default SearchPage

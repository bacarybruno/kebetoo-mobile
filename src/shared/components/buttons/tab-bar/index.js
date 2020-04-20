import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import Ionicon from 'react-native-vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native'

import colors from 'Kebetoo/src/theme/colors'

import styles from './styles'


export default ({ route }) => {
  const { navigate } = useNavigation()
  const navigateToPage = () => navigate(route)
  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        onPress={navigateToPage}
        underlayColor={colors.black}
        style={styles.container}
        activeOpacity={0.6}
      >
        <Ionicon name="md-add" size={24} color={colors.white} />
      </TouchableOpacity>
    </View>
  )
}

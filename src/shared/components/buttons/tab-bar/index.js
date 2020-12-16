import React, { useCallback } from 'react'
import { View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import ActionButton from 'react-native-action-button'

import { useAppColors } from '@app/shared/hooks'

import styles, { size } from './styles'

const TabBarActionButton = ({ route }) => {
  const { navigate } = useNavigation()
  const colors = useAppColors()

  const navigateToPage = useCallback(() => {
    navigate(route)
  }, [navigate, route])

  return (
    <View style={styles.wrapper}>
      <ActionButton
        position="center"
        offsetY={0}
        offsetX={0}
        size={size}
        onPress={navigateToPage}
        buttonColor={colors.primary}
        buttonTextStyle={styles.fab}
        fixNativeFeedbackRadius
      />
    </View>
  )
}

export default TabBarActionButton

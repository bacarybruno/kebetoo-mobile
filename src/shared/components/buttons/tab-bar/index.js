import React, { useCallback } from 'react'
import { View } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import ActionButton from 'react-native-action-button'

import { useAppColors } from '@app/shared/hooks'

import styles, { size } from './styles'
import routes from '@app/navigation/routes'

const getCurrentTab = (nav) => {
  try {
    if (Array.isArray(nav.routes) && nav.routes.lengh > 0) {
      return getCurrentTab(nav.routes[nav.index])
    }
    return nav.routeNames[nav.index]
  } catch (error) {
    return null
  }
}

const TabBarActionButton = () => {
  const { navigate } = useNavigation()
  const { colors } = useAppColors()
  const route = useRoute()

  const navigateToPage = useCallback(() => {
    let routeName = routes.CREATE_POST
    if (getCurrentTab(route.state) === routes.ROOMS) {
      routeName = routes.CREATE_ROOM
    }
    return navigate(routeName)
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

import { useMemo, useRef } from 'react'
import { View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import ActionButton from 'react-native-action-button'
import Ionicon from 'react-native-vector-icons/Ionicons'

import { useAppColors, useAppStyles } from '@app/shared/hooks'
import routes from '@app/navigation/routes'
import {
  Typography, BottomSheetView, Pressable, Badge,
} from '@app/shared/components'
import { StoriesPage } from '@app/navigation/pages'

import { metrics } from '@app/theme'
import createThemedStyles, { size } from './styles'

const IconButton = ({
  icon, text, message, onPress, children, badge, ...otherProps
}) => {
  const styles = useAppStyles(createThemedStyles)
  const { colors } = useAppColors()
  return (
    <View style={styles.iconButtonWrapper}>
      <Pressable style={styles.iconButton} onPress={onPress} {...otherProps}>
        <View style={styles.iconButtonContent}>
          <View style={styles.iconWrapper}>
            <Ionicon style={styles.icon} name={icon} size={28} color={colors.blue_dark} />
          </View>
          <View>
            <Typography
              text={text}
              style={styles.iconButtonTitle}
              type={Typography.types.headline4}
            />
            <Typography
              type={Typography.types.headline5}
              text={message}
              systemColor={Typography.colors.tertiary}
            />
          </View>
        </View>
        <Badge text={badge} />
      </Pressable>
      {children}
    </View>
  )
}

const BottomSheetContent = ({ onDismiss, navigate }) => {
  const styles = useAppStyles(createThemedStyles)

  const navigateToPage = (page, params) => {
    navigate(page, params)
    onDismiss()
  }

  return (
    <View style={styles.flex}>
      <IconButton
        icon="text-outline"
        text="Create a Post"
        onPress={() => navigateToPage(routes.CREATE_POST)}
      />
      <IconButton
        icon="camera-outline"
        text="Create a Viral"
        badge="Beta"
        onPress={() => navigateToPage(routes.STORIES, { mode: StoriesPage.Modes.CreateStory })}
      />
      <IconButton
        icon="chatbubble-ellipses-outline"
        text="Create a Room"
        onPress={() => navigateToPage(routes.CREATE_ROOM)}
      />
    </View>
  )
}


const TabBarActionButton = () => {
  const styles = useAppStyles(createThemedStyles)
  const { navigate } = useNavigation()
  const { colors } = useAppColors()

  const bottomSheet = useRef()

  const baseline = {
    percent: 38,
    height: 896,
  }
  const percent = (metrics.screenHeight * baseline.percent) / baseline.height
  const diffPercent = baseline.percent - percent
  const snapPointPercent = baseline.percent + diffPercent

  const snapPoints = useMemo(() => ['0%', `${snapPointPercent}%`], [snapPointPercent])

  return (
    <>
      <View style={styles.wrapper}>
        <ActionButton
          offsetY={0}
          offsetX={0}
          size={size}
          position="center"
          fixNativeFeedbackRadius
          buttonColor={colors.primary}
          buttonTextStyle={styles.fab}
          onPress={() => bottomSheet.current?.expand()}
        />
      </View>
      <BottomSheetView
        header="Create"
        bottomSheet={bottomSheet}
        headerType={Typography.types.headline2}
        snapPoints={snapPoints}
      >
        <BottomSheetContent
          onDismiss={() => bottomSheet.current.close()}
          navigate={navigate}
        />
      </BottomSheetView>
    </>
  )
}

export default TabBarActionButton

import { useCallback, useMemo } from 'react'
import { View } from 'react-native'
import Ionicon from 'react-native-vector-icons/Ionicons'
import { Portal } from '@gorhom/portal'
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet'

import { Typography } from '@app/shared/components'
import { useAppColors, useAppStyles } from '@app/shared/hooks'

import createThemedStyles from './styles'

export const BottomSheetHeader = ({ header, headerType, onDismiss }) => {
  const styles = useAppStyles(createThemedStyles)
  const { colors } = useAppColors()

  return (
    <View style={styles.commentPanelHeader}>
      <Typography
        text={header}
        type={headerType}
        systemWeight={Typography.weights.semibold}
        style={styles.text}
      />
      <Ionicon
        size={28}
        name="ios-close"
        onPress={onDismiss}
        color={colors.textSecondary}
        style={styles.modalCloseIcon}
      />
    </View>
  )
}

const BottomSheetView = ({
  header,
  children,
  index = 0,
  bottomSheet,
  headerType = Typography.types.body,
  onBottomSheetIndexChange = () => {},
  ...otherProps
}) => {
  const styles = useAppStyles(createThemedStyles)

  const snapPoints = useMemo(() => ['0%', '50%', '70%'], [])

  const renderBackdrop = useCallback((props) => <BottomSheetBackdrop {...props} />, [])

  return (
    <Portal hostName="bottom-sheet">
      <BottomSheet
        index={index}
        ref={bottomSheet}
        handleComponent={null}
        snapPoints={snapPoints}
        backgroundComponent={null}
        backdropComponent={renderBackdrop}
        onChange={onBottomSheetIndexChange}
        {...otherProps}
      >
        <BottomSheetHeader
          header={header}
          headerType={headerType}
          onDismiss={() => bottomSheet.current.close()}
        />
        <View style={styles.content}>{children}</View>
      </BottomSheet>
    </Portal>
  )
}


export default BottomSheetView

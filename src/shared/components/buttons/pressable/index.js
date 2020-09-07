import React from 'react'
import {
  Platform,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from 'react-native'
import colors from '@app/theme/colors'

const CustomPressable = ({ children, ...otherProps }) => (
  <TouchableOpacity {...otherProps}>{children}</TouchableOpacity>
)

CustomPressable.SelectableBackground = () => ({})
CustomPressable.SelectableBackgroundBorderless = () => ({})
CustomPressable.Ripple = () => ({})

const TouchableComponent = Platform.select({
  web: CustomPressable,
  default: Platform.Version <= 20 ? CustomPressable : TouchableNativeFeedback,
})

const Pressable = ({
  children, style, borderless, foreground, ...otherProps
}) => {
  if (TouchableComponent === TouchableNativeFeedback) {
    const rippleBackground = TouchableNativeFeedback.Ripple(colors.placeholder, borderless)
    return (
      <TouchableComponent {...otherProps} useForeground={foreground} background={rippleBackground}>
        <View style={style}>{children}</View>
      </TouchableComponent>
    )
  }

  return <TouchableComponent style={style} {...otherProps}>{children}</TouchableComponent>
}

export default React.memo(Pressable)

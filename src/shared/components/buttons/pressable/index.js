import React, { memo } from 'react'
import {
  Platform,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from 'react-native'

const CustomPressable= ({ children, ...otherProps }) => (
  <TouchableOpacity {...otherProps}>{children}</TouchableOpacity>
)

CustomPressable.SelectableBackground = () => ({})
CustomPressable.SelectableBackgroundBorderless = () => ({})
CustomPressable.Ripple = (color, borderless) => ({})

const TouchableComponent = Platform.select({
  web: CustomPressable,
  default: Platform.Version <= 20 ? CustomPressable : TouchableNativeFeedback,
})

const Pressable = ({ children, style, ...otherProps }) => {
  if (TouchableComponent === TouchableNativeFeedback) {
    return (
      <TouchableComponent {...otherProps} style={{}}>
        <View style={style}>{children}</View>
      </TouchableComponent>
    )
  }

  return <TouchableComponent style={style} {...otherProps}>{children}</TouchableComponent>
}

Pressable.SelectableBackground = TouchableComponent.SelectableBackground
Pressable.SelectableBackgroundBorderless = TouchableComponent.SelectableBackgroundBorderless
Pressable.Ripple = TouchableComponent.Ripple

export default memo(Pressable)
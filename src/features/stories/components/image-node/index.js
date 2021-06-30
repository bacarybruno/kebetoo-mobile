import { useEffect, useRef } from 'react'
import { Image, TouchableOpacity, View } from 'react-native'
import Gestures from 'react-native-easy-gestures'

import StoryViewActionBar from '../actions-bar'
import styles from './styles'

/**
 * TODO:
 * calculate initial position : width = metrics.screenWidth - itemHeight / 2, ...
 * get and extract initial style from package default props
 * implement onEnd to get result
 * save in react ref to not rerender
 * ffmoeg add webm at position with scale ...
 */
const ImageNode = ({
  value,
  focused,
  onBlur,
  onFocus,
  removeNode,
}) => {
  const input = useRef()

  useEffect(() => {
    if (focused) {
      input.current?.focus()
    } else {
      input.current?.blur()
    }
  }, [focused, input])

  const actions = [{
    icon: 'trash',
    text: 'Delete',
    onPress: removeNode,
  }, {
    icon: 'checkmark-circle',
    text: 'Done',
    onPress: onBlur,
  }]

  return (
    <View style={styles.wrapper}>
      <Gestures>
        <TouchableOpacity onPress={onFocus} activeOpacity={1}>
          <Image
            source={{ uri: value.uri }}
            style={styles.sticker}
          />
        </TouchableOpacity>
      </Gestures>
      {focused && <StoryViewActionBar actions={actions} />}
    </View>
  )
}

export default ImageNode

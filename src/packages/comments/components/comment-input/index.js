import React, { useState, useCallback } from 'react'
import { View } from 'react-native'

import TextInput from 'Kebetoo/src/shared/components/inputs/text'
import { AudioPlayer } from 'Kebetoo/src/packages/post/components/audio-content'
import strings from 'Kebetoo/src/config/strings'

import { SendButton, RecordButton } from '../send-button'
import styles from './styles'

const CommentInput = ({
  onChange, onSend, inputRef, value, audioRecorder, ...inputProps
}) => {
  const [inputHeight, setInputHeight] = useState(styles.textInputSize.minHeight)

  const updateInputHeight = useCallback((event) => {
    setInputHeight(
      Math.max(
        styles.textInputSize.minHeight,
        event.nativeEvent.contentSize.height,
      ),
    )
  }, [])

  return (
    <View style={styles.commentInputWrapper}>
      <View style={styles.flexible}>
        {!audioRecorder.hasRecording && (
          <TextInput
            multiline
            fieldName="comment"
            placeholder={strings.comments.add_comment}
            onValueChange={onChange}
            ref={inputRef}
            textStyle={styles.textInputSize}
            wrapperStyle={[
              styles.textInputSize,
              styles.textInputWrapper,
              { height: inputHeight },
            ]}
            onContentSizeChange={updateInputHeight}
            {...inputProps}
          />
        )}
        {audioRecorder.hasRecording && (
          <AudioPlayer
            source={audioRecorder.recordUri}
            onDelete={audioRecorder.reset}
            style={styles.audioWrapper}
            round
          />
        )}
      </View>

      {value.length === 0 && !audioRecorder.hasRecording
        ? (
          <RecordButton audioRecorder={audioRecorder} />
        ) : (
          <SendButton onPress={onSend} />
        )}
    </View>
  )
}

export default React.memo(CommentInput)

import React, { useState, useCallback } from 'react'
import { View } from 'react-native'

import TextInput from 'Kebetoo/src/shared/components/inputs/text'
import AudioPlayer from 'Kebetoo/src/shared/components/audio-player'
import strings from 'Kebetoo/src/config/strings'

import { SendButton, RecordButton } from '../send-button'
import styles from './styles'

const CommentInput = ({
  onChange, onSend, inputRef, value, audioRecorder, isLoading, ...inputProps
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
            editable={!isLoading}
            onContentSizeChange={updateInputHeight}
            wrapperStyle={{
              ...styles.textInputSize,
              ...styles.textInputWrapper,
              height: inputHeight,
            }}
            {...inputProps}
          />
        )}
        {audioRecorder.hasRecording && (
          <View style={styles.audioWrapper}>
            <AudioPlayer
              source={audioRecorder.recordUri}
              onDelete={audioRecorder.reset}
              style={styles.audioPlayer}
              duration={audioRecorder.elapsedTime}
              round
            />
          </View>
        )}
      </View>

      {value.length === 0 && !audioRecorder.hasRecording
        ? (
          <RecordButton
            isRecording={audioRecorder.isRecording}
            start={audioRecorder.start}
            stop={audioRecorder.stop}
          />
        ) : (
          <SendButton onPress={onSend} isLoading={isLoading} testID="send-button" />
        )}
    </View>
  )
}

export default React.memo(CommentInput)

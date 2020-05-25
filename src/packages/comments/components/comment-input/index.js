import React, { memo } from 'react'
import { View } from 'react-native'

import TextInput from 'Kebetoo/src/shared/components/inputs/text'
import { AudioPlayer } from 'Kebetoo/src/packages/post/components/audio-content'

import { SendButton, RecordButton } from '../send-button'
import styles from './styles'


const CommentInput = ({
  onChange, onSend, inputRef, value, audioRecorder, ...inputProps
}) => (
  <View style={styles.commentInputWrapper}>
    <View style={styles.flexible}>
      {!audioRecorder.hasRecording && (
        <TextInput
          fieldName="comment"
          placeholder="Add a comment"
          onValueChange={onChange}
          ref={inputRef}
          textStyle={styles.textInputSize}
          wrapperStyle={[
            styles.textInputSize,
            styles.textInputWrapper,
          ]}
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

export default memo(CommentInput)

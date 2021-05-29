import { memo, useState, useCallback, useRef, useEffect } from 'react'
import { Animated, View } from 'react-native'

import { AudioPlayer, TextInput } from '@app/shared/components'
import { env, strings } from '@app/config'
import { readableSeconds } from '@app/shared/helpers/dates'
import { useAppStyles } from '@app/shared/hooks'

import { SendButton, RecordButton } from '../send-button'
import ReplyInfo from '../reply-info'
import createThemedStyles from './styles'

const baseReplyInfoSize = 62

export const CommentInput = ({
  onChange,
  onSend,
  inputRef,
  value,
  audioRecorder,
  isLoading,
  reply,
  onReplyClose,
  theme,
  placeholder,
  style,
  disableAutofocus = true,
  handleContentSizeChange = true,
  maxLength = env.maxLength.post.comments,
  ...inputProps
}) => {
  const styles = useAppStyles(createThemedStyles)

  const [inputHeight, setInputHeight] = useState(styles.textInputSize.minHeight)
  const inputSize = useRef(new Animated.Value(0))

  useEffect(() => {
    Animated.timing(inputSize.current, {
      toValue: inputHeight + (reply ? baseReplyInfoSize : 0),
      useNativeDriver: false,
      duration: 200,
    }).start()
  }, [inputHeight, reply])

  const updateInputHeight = useCallback((event) => {
    if (!handleContentSizeChange) return
    setInputHeight(
      Math.max(
        styles.textInputSize.minHeight,
        event.nativeEvent.contentSize.height,
      ),
    )
  }, [styles.textInputSize.minHeight, handleContentSizeChange])

  const inputPlaceholder = audioRecorder.isRecording
    ? `${strings.comments.recording} (${readableSeconds(audioRecorder.elapsedTime)})`
    : (placeholder || strings.comments.add_comment)

  const wrapperStyle = [
    styles.textInputSize,
    styles.textInputWrapper,
    reply && styles.textInputWrapperWithReply,
  ]

  return (
    <View style={[styles.commentInputWrapper, style]}>
      <View style={styles.flexible}>
        {!audioRecorder.hasRecording && (
          <TextInput
            multiline
            fieldName="comment"
            onValueChange={onChange}
            value={value}
            ref={inputRef}
            textStyle={styles.textInputSize}
            editable={!isLoading}
            onContentSizeChange={updateInputHeight}
            height={inputSize.current}
            returnKeyType="default"
            disableAutofocus={disableAutofocus}
            maxLength={maxLength}
            wrapperStyle={wrapperStyle}
            placeholder={inputPlaceholder}
            {...inputProps}
          >
            {reply && (
              <ReplyInfo info={reply} size={baseReplyInfoSize} onClose={onReplyClose} />
            )}
          </TextInput>
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
      {value?.length === 0 && !audioRecorder.hasRecording
        ? (
          <View>
            <RecordButton
              isRecording={audioRecorder.isRecording}
              start={audioRecorder.start}
              stop={audioRecorder.stop}
              defaultBgColor={theme}
            />
          </View>
        ) : (
          <SendButton
            onPress={onSend}
            isLoading={isLoading}
            testID="send-button"
            defaultBgColor={theme}
          />
        )}
    </View>
  )
}

export default memo(CommentInput)

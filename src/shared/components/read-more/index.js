import React, { useCallback } from 'react'
import { TouchableWithoutFeedback } from 'react-native'
import ReadMoreText from 'react-native-view-more-text'

import { strings } from '@app/config'
import { edgeInsets } from '@app/theme'

import Typography from '../typography'
import styles from './styles'

export const Reveal = ({ onPress, text }) => (
  <TouchableWithoutFeedback
    onPress={onPress}
    hitSlop={edgeInsets.symmetric({ horizontal: 5, vertical: 10 })}
  >
    <Typography
      text={text}
      type={Typography.types.textButton}
      style={styles.reveal}
      color="primary"
    />
  </TouchableWithoutFeedback>
)

const ReadMore = ({ numberOfLines = 5, text, ...typographyProps }) => {
  const renderViewLess = useCallback((onPress) => (
    <Reveal text={strings.general.show_less.toLowerCase()} onPress={onPress} />
  ), [])

  const renderViewMore = useCallback((onPress) => (
    <Reveal text={strings.general.read_more.toLowerCase()} onPress={onPress} />
  ), [])

  return (
    <ReadMoreText
      numberOfLines={numberOfLines}
      renderViewLess={renderViewLess}
      renderViewMore={renderViewMore}
    >
      <Typography text={text} {...typographyProps} />
    </ReadMoreText>
  )
}

export default ReadMore

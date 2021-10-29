import { useCallback } from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import ReadMoreText from 'react-native-view-more-text';

import { strings } from '@app/config';
import { edgeInsets } from '@app/theme';

import Typography from '../typography';
import styles from './styles';

export const Reveal = ({ onPress, text, type }) => (
  <TouchableWithoutFeedback
    onPress={onPress}
    hitSlop={edgeInsets.symmetric({ horizontal: 5, vertical: 10 })}
  >
    <Typography
      text={text}
      type={type || Typography.types.textButton}
      style={styles.reveal}
      color="primary"
    />
  </TouchableWithoutFeedback>
);

const ReadMore = ({
  numberOfLines = 5, text, revealType, children, ...typographyProps
}) => {
  const renderViewLess = useCallback((onPress) => (
    <Reveal
      type={revealType}
      text={strings.general.show_less.toLowerCase()}
      onPress={onPress}
    />
  ), [revealType]);

  const renderViewMore = useCallback((onPress) => (
    <Reveal
      type={revealType}
      text={strings.general.read_more.toLowerCase()}
      onPress={onPress}
    />
  ), [revealType]);

  return (
    <ReadMoreText
      numberOfLines={numberOfLines}
      renderViewLess={renderViewLess}
      renderViewMore={renderViewMore}
      testID="read-more-text"
    >
      {children || <Typography text={text} {...typographyProps} />}
    </ReadMoreText>
  );
};

export default ReadMore;

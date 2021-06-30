import { useCallback } from 'react';
import { Linking, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ParsedText from 'react-native-parsed-text';
import Snackbar from 'react-native-snackbar';

import { useAppColors, useAppStyles } from '@app/shared/hooks';
import { ReadMore, Typography } from '@app/shared/components';
import { api } from '@app/shared/services';
import routes from '@app/navigation/routes';
import { strings } from '@app/config';

import { warnNotImplemented } from '../../no-content';

import createThemedStyles from './styles';

// A robust regexp for matching URLs. Thanks: https://gist.github.com/dperini/729294
const regWebUrl = /(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?/i;
const regUsername = /@(\w+)/;
const regHashtag = /#(\w+)/;
const regBold = /\*([\w ]*)\*/;
const regItalic = /_([\w ]*)_/;
const regStrikeThrough = /~([\w ]*)~/;

const boldVariants = {
  semi: 'semibold',
  bold: 'bold',
};

const FormatedTypography = ({
  text,
  type = Typography.types.body,
  withReadMore = true,
  style,
  rawValue = false,
  numberOfLines,
  boldVariant = boldVariants.semi,
  systemColor = Typography.colors.primary,
  color = Typography.colors.primary,
  linkStyle,
  disableLinks,
  revealType,
  ...textProps
}) => {
  const styles = useAppStyles(createThemedStyles);
  const { colors } = useAppColors();
  const { navigate } = useNavigation();

  const handleUrlPress = useCallback((url) => {
    if (Linking.canOpenURL(url)) {
      Linking.openURL(url);
    }
  }, []);

  const handleUsernamePress = useCallback(async (username) => {
    const foundAuthors = await api.authors.getByUsername(username);
    if (foundAuthors.length > 0) {
      navigate(routes.USER_PROFILE, { userId: foundAuthors[0]._id });
    } else {
      Snackbar.show({
        text: strings.errors.username_not_exist,
        duration: Snackbar.LENGTH_SHORT,
      });
    }
  }, [navigate]);

  const renderPatternValue = useCallback((_, matches) => matches[rawValue ? 0 : 1], [rawValue]);

  const textStyle = Typography.styles[type];
  const textColor = color || systemColor;
  const baseTextStyle = [textStyle, style, textColor && { color: colors[textColor] }];

  const linkStyles = StyleSheet.flatten([baseTextStyle, styles.link, linkStyle]);
  const boldStyle = StyleSheet.flatten([
    baseTextStyle,
    boldVariant === boldVariants.semi
      ? styles.semibold
      : styles.bold,
  ]);
  const italicStyle = StyleSheet.flatten([baseTextStyle, styles.italic]);
  const strikeThroughStyle = StyleSheet.flatten([baseTextStyle, styles.strikeThrough]);
  const parsePatterns = [
    { type: 'phone', style: linkStyles, onPress: disableLinks ? null : handleUrlPress },
    { type: 'email', style: linkStyles, onPress: disableLinks ? null : handleUrlPress },
    { pattern: regWebUrl, style: linkStyles, onPress: disableLinks ? null : handleUrlPress },
    { pattern: regUsername, style: linkStyles, onPress: disableLinks ? null : handleUsernamePress },
    { pattern: regHashtag, style: linkStyles, onPress: disableLinks ? null : warnNotImplemented },
    { pattern: regBold, style: boldStyle, renderText: renderPatternValue },
    { pattern: regItalic, style: italicStyle, renderText: renderPatternValue },
    { pattern: regStrikeThrough, style: strikeThroughStyle, renderText: renderPatternValue },
  ];

  if (withReadMore) {
    return (
      <ReadMore numberOfLines={numberOfLines} revealType={revealType}>
        <ParsedText parse={parsePatterns} style={baseTextStyle} {...textProps}>
          {text}
        </ParsedText>
      </ReadMore>
    );
  }

  return (
    <ParsedText
      numberOfLines={numberOfLines}
      parse={parsePatterns}
      style={baseTextStyle}
      {...textProps}
    >
      {text}
    </ParsedText>
  );
};

FormatedTypography.boldVariants = boldVariants;

export default FormatedTypography;

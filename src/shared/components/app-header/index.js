import { useCallback, isValidElement } from 'react'
import { View, ActivityIndicator, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import { Avatar, Logo, Typography } from '@app/shared/components'
import routes from '@app/navigation/routes'
import { useAppColors } from '@app/shared/hooks'
import { edgeInsets } from '@app/theme'

import styles from './styles'
import HeaderBack from '../header-back'

export const routeOptions = { headerShown: false }

export const HeaderAvatar = ({ photoURL, displayName, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.headerAvatar}>
    <Avatar src={photoURL} text={displayName} size={30} fontSize={18} />
  </TouchableOpacity>
)

const HeaderNavigationBack = ({ onPress, tintColor }) => (
  <TouchableOpacity onPress={onPress} hitSlop={edgeInsets.all(10)}>
    <HeaderBack tintColor={tintColor} style={styles.headerBack} />
  </TouchableOpacity>
)

const Header = ({
  title = '',
  titleStyle,
  text = '',
  textStyle,
  displayName = '',
  imageSrc,
  style,
  iconColor,
  onGoBack,
  loading = false,
  showAvatar = false,
  headerBack = false,
  Right,
  Logo: HeaderLogo,
}) => {
  const { navigate, goBack } = useNavigation()
  const { colors } = useAppColors()

  const onHeaderPress = useCallback(() => {
    navigate(routes.PROFILE)
  }, [navigate])

  return (
    <View style={[styles.header, style]}>
      <View style={styles.greetings}>
        <View style={styles.section}>
          {headerBack && (
            <HeaderNavigationBack
              tintColor={iconColor || colors.textPrimary}
              onPress={onGoBack || goBack}
            />
          )}
          <View style={{ flex: 1 }}>
            <View style={styles.section}>
              <Typography
                style={[styles.title, titleStyle]}
                numberOfLines={1}
                text={title.replace(' ,', ',')}
                type={Typography.types.headline2}
              />
              <ActivityIndicator
                color={colors.primary}
                style={styles.loading}
                animating={loading}
              />
            </View>
            {text.length > 0 && (
              <View style={styles.section}>
                <Typography
                  text={text}
                  style={textStyle}
                  type={Typography.types.subheading}
                />
                {HeaderLogo || <Logo style={styles.icon} />}
              </View>
            )}
          </View>
        </View>
      </View>
      {isValidElement(Right) && Right}
      {showAvatar && (
        <HeaderAvatar
          displayName={displayName}
          photoURL={imageSrc}
          onPress={onHeaderPress}
        />
      )}
    </View>
  )
}

export default Header

import { useCallback, useState } from 'react'
import { Alert, FlatList, View } from 'react-native'
import Ionicon from 'react-native-vector-icons/Ionicons'

import {
  AppHeader, OutlinedButton, Pressable, Typography,
} from '@app/shared/components'
import { strings } from '@app/config'
import { useAppColors, useAppStyles } from '@app/shared/hooks'

import { useDispatch, useSelector } from 'react-redux'
import { SET_LOCALE } from '@app/redux/types'
import { localeSelector } from '@app/redux/selectors'
import createThemedStyles from './styles'

const routeOptions = { title: strings.languages.languages }

const LanguageChooser = ({ data, onSelect, defaultLanguage }) => {
  const styles = useAppStyles(createThemedStyles)
  const { colors } = useAppColors()

  const renderItem = useCallback(({ item }) => {
    const onSelectItem = () => onSelect(item.locale)
    return (
      <Pressable onPress={onSelectItem} style={styles.item}>
        <Typography
          type={Typography.types.headline4}
          text={item.text}
          style={styles.iconButtonTitle}
        />
        {defaultLanguage === item.locale && (
          <Ionicon
            name="checkmark"
            color={colors.primary}
            size={25}
            style={styles.icon}
          />
        )}
      </Pressable>
    )
  }, [styles, defaultLanguage, colors.primary, onSelect])

  const keyExtractor = useCallback((item) => `language-${item.locale}`, [])

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
    />
  )
}

const LanguagesPage = () => {
  const styles = useAppStyles(createThemedStyles)
  const defaultLanguage = useSelector(localeSelector)
  const [selectedLanguage, setSelectedLanguage] = useState(defaultLanguage)
  const dispatch = useDispatch()

  const languages = [{
    locale: 'en',
    text: 'English',
  }, {
    locale: 'fr',
    text: 'Français',
  }]

  const onSave = useCallback(() => {
    Alert.alert(
      strings.languages.switching_language,
      strings.languages.switching_language_reload, [{
        text: strings.general.ok.toUpperCase(),
        onPress: () => {
          dispatch({ type: SET_LOCALE, payload: selectedLanguage })
        },
      }],
    )
  }, [dispatch, selectedLanguage])

  return (
    <View style={styles.wrapper}>
      <AppHeader
        title={strings.languages.languages}
        headerBack
        Right={(
          <OutlinedButton
            text={strings.general.save.toUpperCase()}
            disabled={defaultLanguage === selectedLanguage}
            onPress={onSave}
          />
        )}
      />
      <LanguageChooser
        data={languages}
        onSelect={setSelectedLanguage}
        defaultLanguage={selectedLanguage}
      />
    </View>
  )
}

LanguagesPage.routeOptions = routeOptions

export default LanguagesPage

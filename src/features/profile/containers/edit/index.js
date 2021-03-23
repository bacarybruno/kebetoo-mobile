import React, {
  useCallback, useEffect, useReducer, useRef, useState,
} from 'react'
import { TouchableOpacity, View, ActivityIndicator, InteractionManager } from 'react-native'
import Ionicon from 'react-native-vector-icons/Ionicons'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import * as yup from 'yup'
import auth from '@react-native-firebase/auth'
import { useDispatch } from 'react-redux'
import twitterText from 'twitter-text'

import { AppHeader, Avatar, OutlinedButton } from '@app/shared/components'
import { env, strings } from '@app/config'
import { useAppStyles, useUser } from '@app/shared/hooks'
import { OutlinedTextInput } from '@app/shared/components/inputs'
import useFilePicker from '@app/features/post/hooks/file-picker'
import reducer, { actionTypes } from '@app/features/account/reducer'
import { SET_USER_PROFILE } from '@app/redux/types'
import { api } from '@app/shared/services'

import createThemedStyles from './styles'

const routeOptions = { title: strings.profile.edit_profile }

const TouchableAvatar = ({ profile, onPress, isLoading }) => {
  const styles = useAppStyles(createThemedStyles)
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} disabled={isLoading}>
      <Avatar src={profile.photoURL} text={profile.displayName} size={115} fontSize={50}>
        <View style={styles.avatarOverlay}>
          {isLoading
            ? <ActivityIndicator size="large" color={styles.avatarOverlayIcon.color} />
            : <Ionicon name="camera" size={35} style={styles.avatarOverlayIcon} />}
        </View>
      </Avatar>
    </TouchableOpacity>
  )
}

export const fieldNames = {
  fullName: 'fullName',
  email: 'email',
  username: 'username',
  bio: 'bio',
}

yup.addMethod(yup.string, 'usernameValidator', function (message) {
  return this.test('validate-username', message, function (value) {
    const { path, createError } = this
    const username = value.startsWith('@') ? value : `@${value}`
    return twitterText.isValidUsername(username) || createError({ path, message })
  })
})

const EditProfile = ({ route, navigation }) => {
  const [avatarLoading, setAvatarLoading] = useState(false)
  const { profile, showAvatarOptions } = useUser()
  const usernameRef = useRef()
  const styles = useAppStyles(createThemedStyles)
  const { navigate, goBack } = navigation
  const { saveImage } = useFilePicker()
  const reduxDispatch = useDispatch()
  const { currentUser } = auth()

  const initialState = {
    values: {
      [fieldNames.email]: profile.email || '',
      [fieldNames.username]: profile.username || '',
      [fieldNames.fullName]: profile.displayName || '',
      [fieldNames.bio]: profile.bio || null,
    },
    errors: {
      [fieldNames.email]: null,
      [fieldNames.username]: null,
      [fieldNames.fullName]: null,
      [fieldNames.bio]: null,
    },
    isLoading: false,
  }
  const [state, dispatch] = useReducer(reducer, initialState)
  const { values, errors, isLoading } = state

  const schema = yup.object().shape({
    [fieldNames.email]: yup.string().email(
      strings.formatString(strings.errors.invalid_field, strings.auth.email),
    ).required(
      strings.formatString(strings.errors.required_field, strings.auth.email),
    ),
    [fieldNames.fullName]: yup.string().required(
      strings.formatString(strings.errors.required_field, strings.auth.fullname),
    ),
    [fieldNames.username]: yup.string().required(
      strings.formatString(strings.errors.required_field, strings.auth.username),
    ).usernameValidator(
      strings.formatString(strings.errors.invalid_field, strings.auth.username),
    ),
    [fieldNames.bio]: yup.string().optional().nullable(),
  })

  const formatUsername = useCallback((val) => {
    value = val.toLowerCase()
    if (value.length > 0 && value[0] !== '@') {
      value = '@' + value
    }
    return value
  }, [])

  const onChangeText = useCallback((val, field) => {
    let value = val
    if (field === fieldNames.username) {
      value = formatUsername(value)
    }
    dispatch({ type: actionTypes.SET_VALUE, payload: { field, value } })
    dispatch({ type: actionTypes.CLEAR_ERROR, payload: field })
  }, [formatUsername])

  const onSubmit = useCallback(async () => {
    try {
      dispatch({ type: actionTypes.START_LOADING })
      await schema.validate(values)

      const payload = {
        username: values[fieldNames.username] || profile.username,
        displayName: values[fieldNames.fullName] || profile.displayName,
        bio: values[fieldNames.bio] || null,
      }

      const foundAuthors = await api.authors.getByUsername(payload.username)
      if (foundAuthors.length > 0 && foundAuthors[0].id !== profile.uid) {
        const usernameTakenError = new Error(strings.errors.username_taken)
        usernameTakenError.name = 'ValidationError'
        usernameTakenError.path = fieldNames.username
        throw usernameTakenError
      }

      await api.authors.update(profile.uid, payload)
      await currentUser.updateProfile(payload)
      reduxDispatch({ type: SET_USER_PROFILE, payload })
      goBack()
    } catch (error) {
      if (error.name === 'ValidationError') {
        dispatch({
          type: actionTypes.SET_ERROR,
          payload: {
            field: error.path,
            value: error.message,
          },
        })
      }
    } finally {
      dispatch({ type: actionTypes.END_LOADING })
    }
  }, [schema, values, profile, currentUser, reduxDispatch, goBack])

  const onAvatarOptions = useCallback(async () => {
    await showAvatarOptions({ onLoading: setAvatarLoading, navigate, saveImage })
  }, [navigate, saveImage, showAvatarOptions])

  useEffect(() => {
    if (route.params?.field === 'username' && usernameRef.current) {
      InteractionManager.runAfterInteractions(() => {
        usernameRef.current.focus()
      })
    }
  }, [route])

  return (
    <KeyboardAwareScrollView
      keyboardShouldPersistTaps="handled"
      enableOnAndroid
      style={styles.wrapper}
    >
      <AppHeader
        title={strings.profile.edit_profile}
        text=""
        showAvatar={false}
        headerBack
        Right={() => (
          <OutlinedButton
            text={strings.general.save.toUpperCase()}
            disabled={false}
            onPress={onSubmit}
            loading={isLoading}
          />
        )}
      />

      <View style={styles.content}>
        <View style={[styles.section, styles.avatar]}>
          <TouchableAvatar
            profile={profile}
            onPress={onAvatarOptions}
            isLoading={avatarLoading}
          />
        </View>

        <View style={styles.section}>
          <OutlinedTextInput
            onChange={onChangeText}
            placeholder={profile.displayName}
            text={profile.displayName}
            label={strings.auth.fullname}
            borderless={false}
            maxLength={env.maxLength.fullname}
            fieldName={fieldNames.fullName}
            error={errors[fieldNames.fullName]}
            editable={!isLoading}
            value={values[fieldNames.fullName]}
          />
        </View>

        <View style={styles.section}>
          <OutlinedTextInput
            label={strings.auth.username}
            onChange={onChangeText}
            placeholder={strings.auth.username}
            text={profile.username}
            borderless={false}
            inputRef={usernameRef}
            maxLength={env.maxLength.username}
            fieldName={fieldNames.username}
            error={errors[fieldNames.username]}
            editable={!isLoading}
            value={values[fieldNames.username]}
          />
        </View>

        <View style={styles.section}>
          <OutlinedTextInput
            label={strings.auth.email}
            placeholder={strings.auth.email}
            text={profile.email}
            borderless={false}
            editable={false}
            maxLength={env.maxLength.email}
            fieldName={fieldNames.email}
            error={errors[fieldNames.email]}
            value={values[fieldNames.email]}
          />
        </View>

        <View style={styles.section}>
          <OutlinedTextInput
            label={strings.profile.bio}
            text={profile.bio}
            onChange={onChangeText}
            placeholder={strings.profile.bio_placeholder}
            borderless={false}
            maxLength={env.maxLength.bio}
            fieldName={fieldNames.bio}
            error={errors[fieldNames.bio]}
            editable={!isLoading}
          />
        </View>
      </View>
    </KeyboardAwareScrollView>
  )
}

EditProfile.routeOptions = routeOptions

export default EditProfile

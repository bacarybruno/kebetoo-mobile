import { useCallback, useEffect, useReducer } from 'react'
import auth from '@react-native-firebase/auth'
import { object as yupObject, string as yupString, reach as yupReach } from 'yup'

import routes from '@app/navigation/routes'
import { strings } from '@app/config'
import { useAnalytics } from '@app/shared/hooks'

import reducer, { actionTypes } from '../../reducer'

export const fieldNames = {
  fullName: 'fullName',
  email: 'email',
  password: 'password',
}


export const initialState = {
  values: { [fieldNames.email]: '', [fieldNames.password]: '', [fieldNames.fullName]: '' },
  errors: { [fieldNames.email]: null, [fieldNames.password]: null, [fieldNames.fullName]: null },
  isLoading: false,
}

const useSignUp = (navigation, emailRef, passwordRef) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const { values, errors, isLoading } = state

  const { trackSignUp, reportError } = useAnalytics()

  const schema = yupObject().shape({
    [fieldNames.fullName]: yupString().required(
      strings.formatString(strings.errors.required_field, strings.auth.fullname),
    ),
    [fieldNames.email]: yupString().email(
      strings.formatString(strings.errors.invalid_field, strings.auth.email),
    ).required(
      strings.formatString(strings.errors.required_field, strings.auth.email),
    ),
    [fieldNames.password]: yupString().min(
      8,
      strings.formatString(strings.errors.min_length_field, strings.auth.password, 8),
    ),
  })

  const onChangeText = useCallback((value, field) => {
    dispatch({ type: actionTypes.SET_VALUE, payload: { field, value } })
    dispatch({ type: actionTypes.CLEAR_ERROR, payload: field })
  }, [])

  const handleAuthError = useCallback((error) => {
    switch (error.code) {
      case 'auth/email-already-in-use':
        dispatch({
          type: actionTypes.SET_ERROR,
          payload: {
            field: fieldNames.email,
            value: strings.errors.auth_email_already_in_use,
          },
        })
        break
      case 'auth/account-exists-with-different-credential':
        dispatch({
          type: actionTypes.SET_ERROR,
          payload: {
            field: fieldNames.email,
            value: strings.errors.auth_account_exists_different_credential,
          },
        })
        break
      // case 'auth/network-request-failed':
      //   //TODO: handler network request fail
      //   break
      default:
        if (error.name === 'ValidationError') {
          dispatch({
            type: actionTypes.SET_ERROR,
            payload: {
              field: error.path,
              value: error.message,
            },
          })
        } else {
          reportError(error)
        }
        break
    }
    dispatch({ type: actionTypes.END_LOADING })
  }, [reportError])

  const onSubmit = useCallback(async () => {
    try {
      dispatch({ type: actionTypes.START_LOADING })
      await schema.validate(values)
      const created = await auth().createUserWithEmailAndPassword(values.email, values.password)
      await created.user.updateProfile({ displayName: values.fullName })
      trackSignUp('password')
    } catch (error) {
      handleAuthError(error)
    }
  }, [schema, values, trackSignUp, handleAuthError])

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      dispatch({ type: actionTypes.END_LOADING })
    })

    return unsubscribe
  }, [])

  const navigateToSignIn = useCallback(() => {
    navigation.navigate(routes.SIGNIN)
  }, [navigation])

  const focusEmail = useCallback(() => {
    emailRef.current.focus()
  }, [emailRef])

  const focusPassword = useCallback(() => {
    passwordRef.current.focus()
  }, [passwordRef])

  const validate = useCallback((field) => {
    try {
      yupReach(schema, field).validateSync(values[field])
      dispatch({ type: actionTypes.CLEAR_ERROR, payload: field })
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: { field, value: error.message } })
    }
  }, [values, schema])

  const onLoading = useCallback(() => {
    dispatch({ type: actionTypes.START_LOADING })
  }, [])

  return {
    onChangeText,
    onSubmit,
    navigateToSignIn,
    focusEmail,
    focusPassword,
    validate,
    onLoading,
    handleAuthError,
    errors,
    isLoading,
  }
}

export default useSignUp

import { useCallback, useReducer } from 'react'
import auth from '@react-native-firebase/auth'
import * as yup from 'yup'

import routes from '@app/navigation/routes'
import { strings } from '@app/config'
import { createUser } from '@app/shared/services/users'
import { useAnalytics } from '@app/shared/hooks'

import reducer, { actionTypes } from '../../reducer'

export const fieldNames = {
  email: 'email',
  password: 'password',
}

export const initialState = {
  values: { [fieldNames.email]: '', [fieldNames.password]: '' },
  errors: { [fieldNames.email]: null, [fieldNames.password]: null },
  isLoading: false,
}

const useSignIn = (navigation, passwordRef) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const { values, errors, isLoading } = state

  const { trackSignIn, reportError } = useAnalytics()

  const schema = yup.object().shape({
    [fieldNames.email]: yup.string().email(
      strings.formatString(strings.errors.invalid_field, strings.auth.email),
    ).required(
      strings.formatString(strings.errors.required_field, strings.auth.email),
    ),
    [fieldNames.password]: yup.string().min(
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
      case 'auth/user-not-found':
        dispatch({
          type: actionTypes.SET_ERROR,
          payload: {
            field: fieldNames.email,
            value: strings.errors.auth_user_not_found,
          },
        })
        break
      case 'auth/wrong-password':
        dispatch({
          type: actionTypes.SET_ERROR,
          payload: {
            field: fieldNames.password,
            value: strings.errors.auth_wrong_password,
          },
        })
        break
      case 'auth/user-disabled':
        dispatch({
          type: actionTypes.SET_ERROR,
          payload: {
            field: fieldNames.email,
            value: strings.errors.auth_user_disabled,
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
        reportError(error)
        break
    }
  }, [reportError])

  const onSubmit = useCallback(async () => {
    try {
      dispatch({ type: actionTypes.START_LOADING })
      await schema.validate(values)
      const { user } = await auth().signInWithEmailAndPassword(values.email, values.password)
      trackSignIn('password')
      await createUser({ id: user.uid, displayName: user.displayName, photoURL: user.photoURL })
    } catch (error) {
      handleAuthError(error)
    } finally {
      dispatch({ type: actionTypes.END_LOADING })
    }
  }, [schema, values, trackSignIn, handleAuthError])

  const navigateToSignUp = useCallback(() => {
    navigation.navigate(routes.SIGNUP)
  }, [navigation])

  const focusPassword = useCallback(() => {
    passwordRef.current.focus()
  }, [passwordRef])

  const validate = useCallback((field) => {
    try {
      yup.reach(schema, field).validateSync(values[field])
      dispatch({ type: actionTypes.CLEAR_ERROR, payload: field })
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: { field, value: error.message } })
    }
  }, [values, schema])

  const onLoading = useCallback((loading) => {
    if (loading) dispatch({ type: actionTypes.START_LOADING })
    else dispatch({ type: actionTypes.END_LOADING })
  }, [])

  return {
    onChangeText,
    onSubmit,
    navigateToSignUp,
    focusPassword,
    validate,
    onLoading,
    handleAuthError,
    errors,
    isLoading,
  }
}

export default useSignIn

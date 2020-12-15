import { useCallback, useReducer } from 'react'
import auth from '@react-native-firebase/auth'
import * as yup from 'yup'

import routes from '@app/navigation/routes'
import { strings } from '@app/config'
import { createUser } from '@app/shared/services/users'
import { useAnalytics } from '@app/shared/hooks'

import reducer, { actionTypes } from '../../reducer'
import { useDispatch } from 'react-redux'
import { SET_USER_PROFILE } from '@app/redux/types'

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
  const reduxDispatch = useDispatch()

  const { values, errors, isLoading } = state

  const { trackSignUp, reportError } = useAnalytics()

  const schema = yup.object().shape({
    [fieldNames.fullName]: yup.string().required(
      strings.formatString(strings.errors.required_field, strings.auth.fullname),
    ),
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
        reportError(error)
        break
    }
  }, [reportError])

  const onSubmit = useCallback(async () => {
    try {
      dispatch({ type: actionTypes.START_LOADING })
      await schema.validate(values)
      const displayName = values.fullName
      reduxDispatch({ type: SET_USER_PROFILE, payload: { displayName } })
      const { user } = await auth().createUserWithEmailAndPassword(values.email, values.password)
      trackSignUp('password')
      await user.updateProfile({ displayName, photoURL: null })
      auth().currentUser = user
      await createUser({ id: user.uid, displayName, photoURL: null })
    } catch (error) {
      handleAuthError(error)
    } finally {
      dispatch({ type: actionTypes.END_LOADING })
    }
  }, [schema, values, reduxDispatch, trackSignUp, handleAuthError])

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

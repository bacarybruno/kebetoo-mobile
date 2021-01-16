import React from 'react'
import { Alert, View } from 'react-native'

import { strings } from '@app/config'

import Typography from '../typography'

import styles from './styles'

export const warnNotImplemented = () => Alert.alert(
  strings.general.not_implemented_title,
  strings.general.not_implemented_description,
)

const NoContent = ({ title, text, children }) => (
  <View style={styles.noContent}>
    {title && (
      <Typography
        text={title}
        type={Typography.types.headline3}
        color="primary"
      />
    )}
    {text && (
      <Typography
        text={text}
        type={Typography.types.headline4}
      />
    )}
    {children}
  </View>
)

export default React.memo(NoContent)

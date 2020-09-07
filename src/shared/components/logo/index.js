import React from 'react'
import { Image } from 'react-native'
import images from '@app/theme/images'

import styles from './styles'

const Logo = () => (
  <Image style={styles.logo} source={images.logo_full} />
)

export default React.memo(Logo)

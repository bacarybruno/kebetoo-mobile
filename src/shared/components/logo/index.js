import React, { memo } from 'react'
import { Image } from 'react-native'
import images from 'Kebetoo/src/theme/images'

import styles from './styles'

const Logo = () => (
  <Image style={styles.logo} source={images.logo_full} />
)

export default memo(Logo)
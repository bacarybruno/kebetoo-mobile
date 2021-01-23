import React from 'react'
import { View } from 'react-native'

import { AppHeader, Typography } from '@app/shared/components'
import { strings } from '@app/config'
import { useAppStyles, useUser } from '@app/shared/hooks'

import createThemedStyles from './styles'

const routeOptions = { title: strings.tabs.rooms }

const RoomsPage = () => {
  const styles = useAppStyles(createThemedStyles)
  const { profile } = useUser()

  return (
    <View style={styles.wrapper}>
      <AppHeader
        title={strings.tabs.rooms}
        text=""
        displayName={profile.displayName}
        imageSrc={profile.photoURL}
        style={styles.pageTitle}
      />
    </View>
  )
}

RoomsPage.routeOptions = routeOptions

export default RoomsPage

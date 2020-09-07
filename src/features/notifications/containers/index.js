import React, { useEffect, useCallback, useState } from 'react'
import { View, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import dayjs from 'dayjs'

import strings from '@app/config/strings'
import useUser from '@app/shared/hooks/user'
import routes from '@app/navigation/routes'
import Header from '@app/features/home/components/header'
import * as api from '@app/shared/helpers/http'
import { useNotifications } from '@app/shared/hooks'
import { NOTIFICATION_STATUS } from '@app/shared/hooks/notifications'

import Notification from '../components/notification'
import Heading from '../components/heading'
import styles from './styles'

const routeOptions = { title: strings.tabs.notifications }

export const NOTIFICATION_TYPES = {
  COMMENT: 'comment',
  POST_REACTION: 'post-reaction',
  COMMENT_REACTION: 'comment-reaction',
}

const Section = ({ title, items, renderItem }) => (
  items.length > 0 && (
    <View style={styles.section}>
      <Heading name={title} value={items.length} />
      {items.map(renderItem)}
    </View>
  )
)

const NotificationsPage = () => {
  const {
    newItems, seenItems, updateSeenStatus, updateOpenStatus,
  } = useNotifications()
  const { addListener, navigate } = useNavigation()
  const { profile } = useUser()

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const removeBlurListener = addListener('blur', () => {
      updateSeenStatus()
    })
    return () => {
      if (removeBlurListener) removeBlurListener()
    }
  }, [addListener, newItems, updateSeenStatus])

  const getAuthor = (message) => {
    const payload = JSON.parse(message.data.payload)
    return payload.author
  }

  const getTitle = (message) => {
    const payload = JSON.parse(message.data.payload)
    const name = payload.author.displayName
    switch (message.data.type) {
      case NOTIFICATION_TYPES.COMMENT:
        return { name, message: strings.notifications.commented_post }
      case NOTIFICATION_TYPES.COMMENT_REACTION:
        return { name, message: strings.notifications.reacted_comment }
      case NOTIFICATION_TYPES.POST_REACTION:
        return { name, message: strings.notifications.reacted_post }
      default:
        return null
    }
  }

  const getMessage = (message) => {
    const payload = JSON.parse(message.data.payload)
    switch (message.data.type) {
      case NOTIFICATION_TYPES.COMMENT:
        return payload.content
      case NOTIFICATION_TYPES.COMMENT_REACTION:
        return payload.comment.content
      case NOTIFICATION_TYPES.POST_REACTION:
        return payload.post.content
      default:
        return null
    }
  }

  const renderNotification = useCallback(({ item, index, onPress }) => (
    <Notification
      isOpened={item.status === NOTIFICATION_STATUS.OPENED}
      onPress={() => onPress(item)}
      title={getTitle(item.message)}
      message={getMessage(item.message)}
      author={getAuthor(item.message)}
      caption={dayjs(item.time).fromNow()}
      key={`${item.id}-${index}`}
    />
  ), [])

  const onNotificationOpen = useCallback(async ({ id, message }) => {
    setIsLoading(true)

    const payload = JSON.parse(message.data.payload)
    let postId = null

    switch (message.data.type) {
      case NOTIFICATION_TYPES.COMMENT:
      case NOTIFICATION_TYPES.POST_REACTION:
        postId = payload.post.id
        break
      case NOTIFICATION_TYPES.COMMENT_REACTION:
        postId = payload.post
        break
      default:
        break
    }

    if (postId) {
      const post = await api.getPost(postId)
      updateOpenStatus(id)
      navigate(routes.COMMENTS, { post })
    }

    setIsLoading(false)
  }, [navigate, updateOpenStatus])

  return (
    <ScrollView style={styles.wrapper} contentContainerStyle={styles.content}>
      <Header
        title={strings.tabs.notifications}
        text=""
        displayName={profile.displayName}
        imageSrc={profile.photoURL}
        style={styles.pageTitle}
        loading={isLoading}
      />
      <Section
        title={strings.notifications.recent}
        items={newItems}
        renderItem={(item, index) => (
          renderNotification({ item, index, onPress: onNotificationOpen })
        )}
      />
      <Section
        title={strings.notifications.already_seen}
        items={seenItems}
        renderItem={(item, index) => (
          renderNotification({ item, index, onPress: onNotificationOpen })
        )}
      />
    </ScrollView>
  )
}

NotificationsPage.routeOptions = routeOptions

export default NotificationsPage

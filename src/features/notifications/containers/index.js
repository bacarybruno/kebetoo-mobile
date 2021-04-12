import { useEffect, useCallback, useState } from 'react'
import { View, ScrollView } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import dayjs from 'dayjs'

import { strings } from '@app/config'
import { useUser, useNotifications, useAppStyles } from '@app/shared/hooks'
import { NOTIFICATION_STATUS } from '@app/shared/hooks/notifications'
import routes from '@app/navigation/routes'
import { api } from '@app/shared/services'
import { AppHeader, NoContent } from '@app/shared/components'

import Notification from '../components/notification'
import Heading from '../components/heading'
import createThemedStyles from './styles'

const routeOptions = { title: strings.tabs.notifications }

export const NOTIFICATION_TYPES = {
  COMMENT: 'comment',
  REPLY: 'reply',
  POST_REACTION: 'post-reaction',
  COMMENT_REACTION: 'comment-reaction',
  SYSTEM: 'system',
}

export const getNotificationTitle = (message) => {
  try {
    const payload = JSON.parse(message.data.payload)
    const { displayName: name, certified } = payload.author
    switch (message.data.type) {
      case NOTIFICATION_TYPES.COMMENT:
        return { name, message: strings.notifications.commented_post }
      case NOTIFICATION_TYPES.COMMENT_REACTION:
        return { name, message: strings.notifications.reacted_comment }
      case NOTIFICATION_TYPES.POST_REACTION:
        return { name, message: strings.notifications.reacted_post }
      case NOTIFICATION_TYPES.REPLY:
        return { name, message: strings.notifications.replied_comment }
      case NOTIFICATION_TYPES.SYSTEM:
        return { name, message: payload.systemMessage, certified }
      default:
        return null
    }
  } catch (error) {
    return null
  }
}

export const getNotificationMessage = (message) => {
  try {
    const payload = JSON.parse(message.data.payload)
    switch (message.data.type) {
      case NOTIFICATION_TYPES.COMMENT:
      case NOTIFICATION_TYPES.REPLY:
      case NOTIFICATION_TYPES.COMMENT_REACTION:
      case NOTIFICATION_TYPES.POST_REACTION:
      case NOTIFICATION_TYPES.SYSTEM:
        return payload.content
      default:
        return null
    }
  } catch (error) {
    return null
  }
}

const Section = ({ title, items, renderItem }) => {
  const styles = useAppStyles(createThemedStyles)
  return (
    items.length > 0 && (
      <View style={styles.section}>
        <Heading name={title} value={items.length} />
        {items.map(renderItem)}
      </View>
    )
  )
}

const NotificationsPage = () => {
  const {
    newItems, seenItems, isEmpty, updateSeenStatus, updateOpenStatus,
  } = useNotifications()
  const { addListener, navigate } = useNavigation()
  const { profile } = useUser()

  const [isLoading, setIsLoading] = useState(false)
  const styles = useAppStyles(createThemedStyles)

  useEffect(() => {
    const removeBlurListener = addListener('blur', () => {
      updateSeenStatus()
    })
    return () => {
      if (removeBlurListener) removeBlurListener()
    }
  }, [addListener, newItems, updateSeenStatus])

  const getAuthor = (message) => {
    try {
      const payload = JSON.parse(message.data.payload)
      return payload.author
    } catch (error) {
      return {}
    }
  }

  const onNotificationOpen = useCallback(async ({ id, message, status }) => {
    try {
      setIsLoading(true)
  
      let postId = null
      const payload = JSON.parse(message.data.payload)
      switch (message.data.type) {
        case NOTIFICATION_TYPES.COMMENT:
        case NOTIFICATION_TYPES.POST_REACTION:
        case NOTIFICATION_TYPES.COMMENT_REACTION:
        case NOTIFICATION_TYPES.REPLY:
        case NOTIFICATION_TYPES.SYSTEM:
          postId = payload.postId
        default:
          break
      }

      if (postId) {
        const post = await api.posts.getById(postId)
        navigate(routes.COMMENTS, { post })
      }
    } finally {
      setIsLoading(false)
      if (status !== NOTIFICATION_STATUS.OPENED) updateOpenStatus(id)
    }
  }, [navigate, updateOpenStatus])

  const renderNotification = useCallback((item, index) => (
    <Notification
      isOpened={item.status === NOTIFICATION_STATUS.OPENED}
      onPress={() => onNotificationOpen(item)}
      title={getNotificationTitle(item.message)}
      message={getNotificationMessage(item.message)}
      author={getAuthor(item.message)}
      caption={dayjs(item.time).fromNow()}
      key={`${item.id}-${index}`}
    />
  ), [onNotificationOpen])

  return (
    <ScrollView style={styles.wrapper} contentContainerStyle={styles.content}>
      <AppHeader
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
        renderItem={renderNotification}
      />
      <Section
        title={strings.notifications.already_seen}
        items={seenItems}
        renderItem={renderNotification}
      />
      {isEmpty && (
        <View style={styles.wrapper}>
          <NoContent text={strings.notifications.no_content} title={strings.general.no_content} />
        </View>
      )}
    </ScrollView>
  )
}

NotificationsPage.routeOptions = routeOptions

export default NotificationsPage

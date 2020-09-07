import { NOTIFICATION_STATUS } from '@app/shared/hooks/notifications'
import { NOTIFICATION_TYPES } from '@app/features/notifications/containers'

import authors from './authors.json'
import textPost from './posts/text.json'
import audioPost from './posts/audio.json'

const notifications = [{
  id: 'notification-1',
  time: Date.now(),
  message: {
    data: {
      type: NOTIFICATION_TYPES.POST_REACTION,
      payload: JSON.stringify({
        author: authors[0],
        post: {
          content: textPost.content,
          id: textPost.id,
        },
      }),
    },
  },
  status: NOTIFICATION_STATUS.NEW,
}, {
  id: 'notification-2',
  time: Date.now(),
  message: {
    data: {
      type: NOTIFICATION_TYPES.COMMENT,
      payload: JSON.stringify({
        author: authors[0],
        content: audioPost.comments[0].content,
        post: {
          id: audioPost.id,
        },
      }),
    },
  },
  status: NOTIFICATION_STATUS.SEEN,
}, {
  id: 'notification-3',
  time: Date.now(),
  message: {
    data: {
      type: NOTIFICATION_TYPES.COMMENT_REACTION,
      payload: JSON.stringify({
        author: authors[1],
        comment: {
          content: audioPost.comments[1].content,
        },
        post: audioPost.id,
      }),
    },
  },
  status: NOTIFICATION_STATUS.OPENED,
}]

export default notifications

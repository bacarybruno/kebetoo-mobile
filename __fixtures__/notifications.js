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
        postId: textPost.id,
        author: authors[0],
        content: textPost.content,
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
        postId: audioPost.id,
        author: authors[0],
        content: audioPost.comments[0].content,
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
        postId: audioPost.id,
        author: authors[1],
        content: audioPost.comments[1].content,
      }),
    },
  },
  status: NOTIFICATION_STATUS.OPENED,
}]

export default notifications

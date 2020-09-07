import { combineReducers } from 'redux'

import { NOTIFICATION_STATUS } from '@app/shared/hooks/notifications'

import * as types from '../types'

const initialState = {
  notifications: [],
}

const notifications = (state = initialState.notifications, action) => {
  switch (action.type) {
    case types.ADD_NOTIFICATION:
      return [
        ...state, {
          id: action.payload.messageId,
          time: action.payload.sentTime,
          message: action.payload,
          status: NOTIFICATION_STATUS.NEW,
        },
      ]
    case types.UPDATE_NOTIFICATION_STATUS:
      return [
        ...state.filter((message) => message.id !== action.payload.id), {
          ...state.find((message) => message.id === action.payload.id),
          status: action.payload.status,
        },
      ]
    default:
      return state
  }
}

export default combineReducers({
  notifications,
})

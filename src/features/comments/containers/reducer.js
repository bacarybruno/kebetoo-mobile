export const initialState = {
  authors: {},
  comment: '',
  toReply: null,
  comments: [],
  replies: {},
  isLoading: false,
}

export const actionTypes = {
  SET_AUTHORS: 'SET_AUTHORS',
  SET_COMMENTS: 'SET_COMMENTS',
  CLEAR_COMMENT: 'CLEAR_COMMENT',
  ADD_REPLIES: 'ADD_REPLIES',
  SET_REPLIES: 'SET_REPLIES',
  CLEAR_TO_REPLY: 'CLEAR_TO_REPLY',
  ADD_COMMENT: 'ADD_COMMENT',
  SET_TO_REPLY: 'SET_TO_REPLY',
  SET_COMMENT: 'SET_COMMENT',
  START_LOADING: 'START_LOADING',
  END_LOADING: 'END_LOADING',
}

const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_COMMENTS:
      return { ...state, comments: action.payload }
    case actionTypes.SET_COMMENT:
      return { ...state, comment: action.payload }
    case actionTypes.SET_AUTHORS:
      return { ...state, authors: action.payload }
    case actionTypes.CLEAR_COMMENT:
      return { ...state, comment: '' }
    case actionTypes.CLEAR_TO_REPLY:
      return { ...state, toReply: null }
    case actionTypes.ADD_COMMENT:
      return { ...state, comments: [...state.comments, action.payload] }
    case actionTypes.SET_TO_REPLY:
      return { ...state, toReply: action.payload }
    case actionTypes.START_LOADING:
      return { ...state, isLoading: true }
    case actionTypes.END_LOADING:
      return { ...state, isLoading: false }
    case actionTypes.ADD_REPLIES:
      return {
        ...state,
        replies: {
          ...state.replies,
          [action.payload.threadId]: [
            ...(state.replies[action.payload.threadId] || []).concat(action.payload.replies),
          ],
        },
      }
    case actionTypes.SET_REPLIES:
      return {
        ...state,
        replies: {
          ...state.replies,
          [action.payload.threadId]: action.payload.replies,
        },
      }
    default:
      throw new Error(`Unknown action type ${action.type} send with payload ${action.payload}`)
  }
}

export default reducer
